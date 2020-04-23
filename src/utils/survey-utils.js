import { CONDITION_TYPES } from '../utils/conditional-logic';
import uuid from 'uuid/v1';

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
