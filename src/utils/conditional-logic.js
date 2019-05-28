import * as _ from 'lodash';
import * as moment from 'moment';

/**
 *  Returns a boolean that is the result of evaluation the condition against the question
 * @param {*} condition the condition we have to verify
 * @param {*} targetQuestion the question that holds the value we need to compare against
 */
export const evaluateCondition = (condition, targetQuestion) => {
  const CONDITION_TYPES = {
    EQUALS: 'equals',
    LESS_THAN: 'less_than',
    GREATER_THAN: 'greater_than',
    LESS_THAN_EQ: 'less_than_eq',
    GREATER_THAN_EQ: 'greater_than_eq',
    BETWEEN: 'between'
  };
  if (!targetQuestion) {
    return false;
  }

  if (condition.operator === CONDITION_TYPES.EQUALS) {
    return targetQuestion.value === condition.value;
  }
  if (condition.operator === CONDITION_TYPES.LESS_THAN) {
    if (moment.isMoment(targetQuestion.value)) {
      return moment().diff(targetQuestion.value, 'years') < condition.value;
    }
    return targetQuestion.value < condition.value;
  }
  if (condition.operator === CONDITION_TYPES.GREATER_THAN) {
    if (moment.isMoment(targetQuestion.value)) {
      return moment().diff(targetQuestion.value, 'years') > condition.value;
    }
    return targetQuestion.value > condition.value;
  }
  if (condition.operator === CONDITION_TYPES.LESS_THAN_EQ) {
    if (moment.isMoment(targetQuestion.value)) {
      return moment().diff(targetQuestion.value, 'years') <= condition.value;
    }
    return targetQuestion.value <= condition.value;
  }
  if (condition.operator === CONDITION_TYPES.GREATER_THAN_EQ) {
    if (moment.isMoment(targetQuestion.value)) {
      return moment().diff(targetQuestion.value, 'years') >= condition.value;
    }
    return targetQuestion.value >= condition.value;
  }
  return false;
};

/**
 * Checks if the condition is met given the condition and the current state of
 * the draft
 * @param {*} condition the condition object
 * @param {*} currentDraft draft object from redux state
 * @param {*} memberIndex the index of the member inside the family data
 */
export const conditionMet = (condition, currentDraft, memberIndex) => {
  const CONDITION_TYPES = {
    SOCIOECONOMIC: 'socioEconomic',
    FAMILY: 'family'
  };
  const socioEconomicAnswers = currentDraft.economicSurveyDataList || [];
  const { familyMembersList } = currentDraft.familyData;
  let targetQuestion = null;
  if (condition.type === CONDITION_TYPES.SOCIOECONOMIC) {
    // In this case target should be located in the socioeconomic answers
    targetQuestion = socioEconomicAnswers.find(
      element => element.key === condition.codeName
    );
  } else if (condition.type === CONDITION_TYPES.FAMILY) {
    const familyMember = familyMembersList[memberIndex];
    // TODO HARDCODED FOR IRRADIA. WE NEED A BETTER WAY TO SPECIFY THAT THE CONDITION
    // HAS BEEN MADE ON A DATE
    // const value = familyMember[condition.codeName]
    //   ? moment.unix(familyMember[condition.codeName])
    //   : null;
    // TODO hardcoded for Irradia, the survey has an error with the field.
    // The lines above should be used once data is fixed for that survey
    const value = familyMember['birthDate']
      ? moment.unix(familyMember['birthDate'])
      : null;
    targetQuestion = { value };
    // TODO DELETE THIS after reviewing the conditional logic
    // In case the target question is null, we should return true.
    // Eventually, the conditional object should include information about that
    // and delete this hard-coding
    if (!value) {
      return true;
    }
  }

  // Added support for showIfNoData. In the case this field is set to true in the
  // condition config and the target question does not have value, we show the question
  // without any further evaluation
  if (condition.showIfNoData && (!targetQuestion || !targetQuestion.value)) {
    return true;
  }
  // Addind support for several values spec. In case we find more than one value,
  // the condition is considered to be met if the evaluation returns true for at least one
  // of the values received in the array
  if (_.isArray(condition.values) && condition.values.length > 0) {
    return condition.values.reduce((acc, current) => {
      return (
        acc ||
        evaluateCondition({ ...condition, value: current }, targetQuestion)
      );
    }, false);
  }
  return evaluateCondition(condition, targetQuestion);
};

/**
 * Decides whether a question should be shown to the user or not
 * @param {*} question the question we want to know if can be shown
 * @param {*} currentDraft the draft from redux state
 */
export const shouldShowQuestion = (question, currentDraft, memberIndex) => {
  let shouldShow = true;
  if (question.conditions && question.conditions.length > 0) {
    question.conditions.forEach(condition => {
      if (!conditionMet(condition, currentDraft, memberIndex)) {
        shouldShow = false;
      }
    });
  }
  return shouldShow;
};

/**
 * This function is used so we can know beforehand if the family member
 * meets the condition for at least one of the questions
 * @param {*} questions the questions for each family member.
 * @param {*} currentDraft the draft from redux state
 * @param {*} memberIndex the index of the member in the store
 */
export const familyMemberWillHaveQuestions = (
  questions,
  currentDraft,
  memberIndex
) => {
  return questions.forFamilyMember.reduce(
    (acc, current) =>
      acc || shouldShowQuestion(current, currentDraft, memberIndex),
    false
  );
};
