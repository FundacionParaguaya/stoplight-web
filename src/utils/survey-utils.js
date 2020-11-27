import * as _ from 'lodash';
import uuid from 'uuid/v1';
import * as Yup from 'yup';
import { CONDITION_TYPES } from '../utils/conditional-logic';
import { shouldShowQuestion } from './conditional-logic';

export const getEconomicScreens = survey => {
  let currentDimension = '';
  const questionsPerScreen = [];
  let totalScreens = 0;

  // go trough all questions and separate them by screen
  survey.surveyEconomicQuestions.forEach(question => {
    // if the dimention of the questions change, change the page
    if (question.topic !== currentDimension) {
      currentDimension = question.topic;
      totalScreens += 1;
    }

    // if there is object for n screen create one
    if (!questionsPerScreen[totalScreens - 1]) {
      questionsPerScreen[totalScreens - 1] = {
        forFamilyMember: [],
        forFamily: []
      };
    }

    if (question.forFamilyMember) {
      questionsPerScreen[totalScreens - 1].forFamilyMember.push(question);
    } else {
      questionsPerScreen[totalScreens - 1].forFamily.push(question);
    }
  });

  return {
    questionsPerScreen
  };
};

export const getConditionalQuestions = survey => {
  const surveyEconomicQuestions = survey.surveyEconomicQuestions || [];
  const conditionalQuestions = [];
  surveyEconomicQuestions.forEach(eq => {
    if (
      (eq.conditions && eq.conditions.length > 0) ||
      (eq.conditionGroups && eq.conditionGroups.length > 0)
    ) {
      conditionalQuestions.push(eq);
    } else {
      // Checking conditional options only if needed
      const options = eq.options || [];
      for (const option of options) {
        if (option.conditions && option.conditions.length > 0) {
          conditionalQuestions.push(eq);
          return;
        }
      }
    }
  });
  return conditionalQuestions;
};

export const getElementsWithConditionsOnThem = conditionalQuestions => {
  const questionsWithConditionsOnThem = [];
  const memberKeysWithConditionsOnThem = [];

  const addTargetIfApplies = condition => {
    // Addind this so it works after changing the key to scope
    const scope = condition.scope || condition.type;
    if (
      scope !== CONDITION_TYPES.FAMILY &&
      !questionsWithConditionsOnThem.includes(condition.codeName)
    ) {
      questionsWithConditionsOnThem.push(condition.codeName);
    }
    if (
      scope === CONDITION_TYPES.FAMILY &&
      !memberKeysWithConditionsOnThem.includes(condition.codeName)
    ) {
      memberKeysWithConditionsOnThem.push(condition.codeName);
    }
  };

  conditionalQuestions.forEach(conditionalQuestion => {
    let conditions = [];
    const { conditionGroups } = conditionalQuestion;
    if (conditionGroups && conditionGroups.length > 0) {
      conditionGroups.forEach(conditionGroup => {
        conditions = [...conditions, ...conditionGroup.conditions];
      });
    } else {
      ({ conditions = [] } = conditionalQuestion);
    }

    conditions.forEach(addTargetIfApplies);

    // Checking conditional options only if needed
    const options = conditionalQuestion.options || [];
    options.forEach(option => {
      const { conditions: optionConditions = [] } = option;
      optionConditions.forEach(addTargetIfApplies);
    });
  });
  return { questionsWithConditionsOnThem, memberKeysWithConditionsOnThem };
};

export const snapshotToDraft = (snapshot, family, familyId) => {
  const el = { ...snapshot.data.data.getLastSnapshot };
  // Mapping keys for family data
  const familyData = { ...el.family };
  const previousIndicatorSurveyDataList = [
    ...el.previousIndicatorSurveyDataList
  ];
  const previousIndicatorPriorities = [...el.snapshotStoplightPriorities];
  const previousIndicatorAchivements = [...el.snapshotStoplightAchievements];
  delete el.snapshotStoplightPriorities;
  delete el.snapshotStoplightAchievements;
  familyData.familyId = familyId;
  familyData.familyMembersList = el.family.familyMemberDTOList.map(member => {
    return {
      ...member,
      socioEconomicAnswers: []
    };
  });
  delete el.family;
  delete familyData.familyMemberDTOList;
  const draft = {
    sign: '',
    pictures: [],
    draftId: uuid(), // generate unique id based on timestamp
    surveyId: family.snapshotIndicators.surveyId,
    created: Date.now(),
    economicSurveyDataList: [],
    indicatorSurveyDataList: [],
    priorities: [],
    achievements: [],
    ...el,
    familyData,
    previousIndicatorSurveyDataList,
    previousIndicatorPriorities,
    previousIndicatorAchivements,
    lifemapNavHistory: [],
    isRetake: true
  };

  return draft;
};

export const capitalize = string => _.startCase(string).replace(/ /g, '');

const fieldIsRequired = 'validation.fieldIsRequired';

const buildValidationForField = question => {
  let validation = Yup.string();
  if (question.required) {
    validation = validation.required(fieldIsRequired);
  }
  return validation;
};

/**
 * Builds the validation schema that will be used by Formik
 * @param {*} questions The list of economic questions for the current screen
 * @param {*} draft the current draft from redux state
 */
export const buildValidationSchemaForQuestions = (questions, draft) => {
  const forFamilySchema = {};
  const familyQuestions = (questions && questions.forFamily) || [];

  familyQuestions.forEach(question => {
    if (shouldShowQuestion(question, draft)) {
      forFamilySchema[question.codeName] = buildValidationForField(question);
    }
  });

  const forFamilyMemberSchema = {};
  const familyMemberQuestions = (questions && questions.forFamilyMember) || [];
  const familyMembersList = _.get(draft, 'familyData.familyMembersList', []);

  familyMembersList.forEach((_member, index) => {
    const memberScheme = {};
    familyMemberQuestions.forEach(question => {
      if (shouldShowQuestion(question, draft, index)) {
        memberScheme[question.codeName] = buildValidationForField(question);
      }
    });
    forFamilyMemberSchema[index] = Yup.object().shape({
      ...memberScheme
    });
  });

  const validationSchema = Yup.object().shape({
    forFamily: Yup.object().shape(forFamilySchema),
    forFamilyMember: Yup.object().shape(forFamilyMemberSchema)
  });
  return validationSchema;
};

/**
 * Based on the current draft, builds the initial values of the economics section
 * @param {*} questions The list of economic questions for the current screen
 * @param {*} draft the current draft from redux state
 */
export const buildInitialValuesForForm = (questions, draft) => {
  const forFamilyInitial = {};
  const familyQuestions = (questions && questions.forFamily) || [];

  familyQuestions.forEach(question => {
    const draftQuestion =
      draft.economicSurveyDataList.find(e => e.key === question.codeName) || {};

    const hasOtherOption = question.options.find(o => o.otherOption);

    if (hasOtherOption) {
      forFamilyInitial[`custom${capitalize(question.codeName)}`] =
        draftQuestion.hasOwnProperty('other') && !!draftQuestion.other
          ? draftQuestion.other
          : '';
    }

    forFamilyInitial[question.codeName] =
      (Object.prototype.hasOwnProperty.call(draftQuestion, 'value') &&
      !!draftQuestion.value
        ? draftQuestion.value
        : draftQuestion.multipleValue) || '';

    delete forFamilyInitial[question.codeName].text;
  });

  const forFamilyMemberInitial = {};
  const familyMemberQuestions = (questions && questions.forFamilyMember) || [];
  const familyMembersList = _.get(draft, 'familyData.familyMembersList', []);
  familyMembersList.forEach((familyMember, index) => {
    const memberInitial = {};
    const socioEconomicAnswers = familyMember.socioEconomicAnswers || [];
    familyMemberQuestions.forEach(question => {
      const draftQuestion =
        socioEconomicAnswers.find(e => e.key === question.codeName) || {};

      if (question.options.find(o => o.otherOption)) {
        memberInitial[`custom${capitalize(question.codeName)}`] =
          draftQuestion.hasOwnProperty('other') && !!draftQuestion.other
            ? draftQuestion.other
            : '';
      }

      memberInitial[question.codeName] =
        (Object.prototype.hasOwnProperty.call(draftQuestion, 'value') &&
        !!draftQuestion.value
          ? draftQuestion.value
          : draftQuestion.multipleValue) || '';
    });
    forFamilyMemberInitial[index] = memberInitial;
  });

  return {
    forFamily: forFamilyInitial,
    forFamilyMember: forFamilyMemberInitial
  };
};
