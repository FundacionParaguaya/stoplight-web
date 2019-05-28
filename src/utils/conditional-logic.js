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
    NOT_EQUALS: 'not_equals',
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
    if (moment.isMoment(targetQuestion.value)) {
      return moment().diff(targetQuestion.value, 'years') === condition.value;
    }
    return targetQuestion.value === condition.value;
  }
  if (condition.operator === CONDITION_TYPES.NOT_EQUALS) {
    if (moment.isMoment(targetQuestion.value)) {
      return moment().diff(targetQuestion.value, 'years') !== condition.value;
    }
    return targetQuestion.value !== condition.value;
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
    let value;
    if (condition.codeName.toLowerCase() === 'birthdate') {
      value = familyMember['birthDate']
        ? moment.unix(familyMember['birthDate'])
        : null;
      // TODO DELETE THIS after reviewing the conditional logic
      // In case the target question is null, we should return true.
      // Eventually, the conditional object should include information about that
      // and delete this hard-coding
      if (!value) {
        // Now we have a proper feature of showIfNoData. Keeping this
        // hardcode just for backwards compatibility for IRRADIA.
        return true;
      }
    } else {
      value = familyMember[condition.codeName];
    }
    targetQuestion = { value };
  }

  // Added support for showIfNoData. In the case this field is set to true in the
  // condition config and the target question does not have value, we show the question
  // without any further evaluation
  if (
    condition.showIfNoData &&
    (!targetQuestion || (!targetQuestion.value && targetQuestion.value !== 0))
  ) {
    return true;
  }
  // Adding support for several values spec. In case we find more than one value,
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

/**
 * Filters the options that are going to be displayed for a question
 * for the case when they're conditional
 * @param {*} question the question that has the options to filter
 * @param {*} currentDraft the draft from the redux store
 * @param {*} index the index of the family member
 */
export const getConditionalOptions = (question, currentDraft, index) =>
  question.options.filter(option =>
    shouldShowQuestion(option, currentDraft, index)
  );

/**
 * Returns a boolean indicating if the value of the conditionalQuestion should be cleaned up.
 * @param {*} conditionalQuestion the question whose answer we'll check if should be cleaned up
 * @param {*} currentDraft the draft from the redux store
 * @param {*} member
 * @param {*} memberIndex
 */
export const shouldCleanUp = (
  conditionalQuestion,
  currentDraft,
  member,
  memberIndex
) => {
  let currentAnswer;
  if (conditionalQuestion.forFamilyMember) {
    currentAnswer = _.get(member, 'socioEconomicAnswers', []).find(
      ea => ea.key === conditionalQuestion.codeName
    );
  } else {
    currentAnswer = _.get(currentDraft, 'economicSurveyDataList', []).find(
      ea => ea.key === conditionalQuestion.codeName
    );
  }
  if (!currentAnswer || !currentAnswer.value) {
    // There's nothing to cleanUp, user has not answered the question yet
    console.log(
      `Nothing to cleanUp for conditionalQuestion ${
        conditionalQuestion.codeName
      }`
    );
    return false;
  }
  let cleanUp = false;
  if (
    conditionalQuestion.conditions &&
    conditionalQuestion.conditions.length > 0
  ) {
    cleanUp = !shouldShowQuestion(
      conditionalQuestion,
      currentDraft,
      memberIndex
    );
  }
  if (
    !cleanUp &&
    conditionalQuestion.options &&
    conditionalQuestion.options.length > 0
  ) {
    // Putting this in an if block so we don't check cleaning up for unavailable selected option
    // in the case it's already decided we have to clean

    // Verifying if current value is not present among the filtered conditional
    // options, in which case we'll need to cleanup
    const availableOptions = getConditionalOptions(
      conditionalQuestion,
      currentDraft,
      memberIndex
    );
    cleanUp = !availableOptions.find(
      option => option.value === currentAnswer.value
    );
  }
  console.log(
    `CleanUp needed for conditionalQuestion ${
      conditionalQuestion.codeName
    }: ${cleanUp}`
  );
  return cleanUp;
};
