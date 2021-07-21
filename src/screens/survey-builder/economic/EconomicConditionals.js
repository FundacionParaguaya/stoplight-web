import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { updateSurvey } from '../../../redux/actions';
import Conditionals from './Conditionals';
import PreviewTabs from '../PreviewTabs';

const useStyles = makeStyles(theme => ({
  conditionsContainer: {
    width: '-webkit-fill-available',
    display: 'flex',
    flexDirection: 'column',
    padding: '3rem 12%'
  },
  tabsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  placeHolder: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '60vh'
  },
  saveButton: {
    margin: '6px 0 6px 6px'
  }
}));

const EconomicConditionals = ({
  currentSurvey,
  updateSurvey,
  surveyTopics,
  selectedSurveyTopic,
  setSelectedSurveyTopic,
  onSave
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const updateConditions = (question, conditions) => {
    const newQuestions = Array.from(currentSurvey.surveyEconomicQuestions).map(
      q => {
        // Clean questions conditions
        let newConditions = Array.from(q.conditions || []).filter(
          c => c.codeName !== question.codeName
        );

        // Clean options conditions
        let newOptions = Array.from(q.options || []).map(option => {
          let newConditions = (option.conditions || []).filter(
            c => c.codeName !== question.codeName
          );
          option.conditions = newConditions;
          return option;
        });
        q.options = newOptions;

        // Clean age conditions
        if (q.codeName === question.codeName) {
          newConditions = Array.from(q.conditions || []).filter(
            c => c.type !== 'family'
          );
        }
        q.conditions = newConditions;
        return q;
      }
    );

    // Add all conditions again
    conditions.forEach(condition => {
      // Case for ages condition
      if (condition.variant === 'family') {
        const questionIndex = newQuestions.findIndex(
          q => q.codeName === question.codeName
        );
        let newConditions = Array.from(
          newQuestions[questionIndex].conditions || []
        );
        newConditions.push({
          codeName: 'birthDate',
          type: 'family',
          operator: condition.operator,
          value: condition.value,
          order: condition.order
        });
        newQuestions[questionIndex].conditions = newConditions;
      }
      // Case for questions conditions
      else if (condition.variant === 'questions') {
        condition.targets.forEach(target => {
          const questionIndex = newQuestions.findIndex(
            q => q.codeName === target
          );
          let newConditions = Array.from(
            newQuestions[questionIndex].conditions || []
          );
          newConditions.push({
            codeName: question.codeName,
            type: question.forFamilyMember
              ? 'memberSocioEconomic'
              : 'socioEconomic',
            operator: condition.operator,
            value: condition.value,
            order: condition.order
          });
          newQuestions[questionIndex].conditions = newConditions;
        });
      }
      // Case for options conditions
      else if (condition.variant === 'options') {
        const questionIndex = newQuestions.findIndex(
          q => q.codeName === condition.targets[0]
        );
        let newOptions = Array.from(newQuestions[questionIndex].options);
        condition.conditionalOptions.forEach(targetOption => {
          const optionIndex = newOptions.findIndex(
            o => o.value === targetOption
          );
          let newConditions = newOptions[optionIndex].conditions || [];
          newConditions.push({
            codeName: question.codeName,
            type: question.forFamilyMember
              ? 'memberSocioEconomic'
              : 'socioEconomic',
            operator: condition.operator,
            value: condition.value,
            values: [condition.value],
            valueType: 'string',
            showIfNoData: false,
            order: condition.order
          });
          newOptions[optionIndex].conditions = newConditions;
        });
        newQuestions[questionIndex].options = newOptions;
      }
    });

    updateSurvey({
      ...currentSurvey,
      surveyEconomicQuestions: newQuestions
    });
  };

  const deleteCondition = (question, condition) => {
    const newQuestions = Array.from(currentSurvey.surveyEconomicQuestions);

    // Remove specific conditions
    // Case for Age condition
    if (condition.variant === 'family') {
      const questionIndex = newQuestions.findIndex(
        q => q.codeName === question.codeName
      );
      newQuestions[questionIndex].conditions = (
        newQuestions[questionIndex].conditions || []
      ).filter(
        c =>
          !(
            c.codeName === 'birthDate' &&
            c.type === 'family' &&
            c.operator === condition.operator
          )
      );
    }
    // Case for Question condition
    else if (condition.variant === 'questions') {
      condition.targets.forEach(target => {
        const questionIndex = newQuestions.findIndex(
          q => q.codeName === target
        );
        newQuestions[questionIndex].conditions = Array.from(
          newQuestions[questionIndex].conditions || []
        ).filter(
          c =>
            !(
              c.codeName === question.codeName &&
              c.value === condition.value &&
              c.operator === condition.operator
            )
        );
      });
      // Case for Optionts condition
    } else if (condition.variant === 'options') {
      const questionIndex = newQuestions.findIndex(
        q => q.codeName === condition.targets[0]
      );
      let newOptions = Array.from(
        newQuestions[questionIndex].options || []
      ).map(option => {
        let newConditions = (option.conditions || []).filter(
          c => c.codeName !== question.codeName
        );
        option.conditions = newConditions;
        return option;
      });
      newQuestions[questionIndex].options = newOptions;
    }

    updateSurvey({
      ...currentSurvey,
      surveyEconomicQuestions: newQuestions
    });
  };

  return (
    <div className={classes.conditionsContainer}>
      <Typography variant="h5">
        {t('views.surveyBuilder.economic.conditional')}
      </Typography>
      <div className={classes.tabsContainer}>
        <PreviewTabs
          surveyTopics={surveyTopics}
          selectedSurveyTopic={selectedSurveyTopic}
          setSelectedSurveyTopic={setSelectedSurveyTopic}
        />
        <div>
          <Button
            color="primary"
            variant="contained"
            className={classes.saveButton}
            onClick={() => onSave()}
          >
            {t('general.save')}
          </Button>
        </div>
      </div>
      {!!selectedSurveyTopic &&
        Array.isArray(currentSurvey.surveyEconomicQuestions) &&
        currentSurvey.surveyEconomicQuestions
          .filter(q => q.topic === selectedSurveyTopic.text)
          .map((question, index) => {
            // Recover age conditions
            let conditionsAssociated = (question.conditions || [])
              .filter(c => c.type === 'family')
              .map(c => ({ ...c, variant: 'family' }));

            // For every question we have to iterate through all other question to retrieve relevant conditions
            currentSurvey.surveyEconomicQuestions.forEach(cq => {
              //Case for related question's conditions
              const relevantConditions = (cq.conditions || [])
                .filter(condition => condition.codeName === question.codeName)
                .map(condition => ({
                  ...condition,
                  variant: 'questions',
                  target: cq.codeName
                }));
              //Case for related options conditions
              let conditionalOptions = [];
              (cq.options || []).forEach(option => {
                const singleOptionConditions = (option.conditions || [])
                  .filter(condition => condition.codeName === question.codeName)
                  .map(condition => ({
                    ...condition,
                    optionValue: option.value
                  }));
                conditionalOptions = [
                  ...conditionalOptions,
                  ...singleOptionConditions
                ];
              });

              // Pre-proccess all options condtions for better handling
              let relevantOptionsConditions = [];
              conditionalOptions.forEach(condition => {
                const index = relevantOptionsConditions.findIndex(
                  c =>
                    (c.value === condition.value ||
                      (Array.isArray(condition.values) &&
                        c.value === condition.values[0])) &&
                    c.operator === condition.operator
                );
                if (index >= 0) {
                  relevantOptionsConditions[index].conditionalOptions = [
                    ...relevantOptionsConditions[index].conditionalOptions,
                    condition.optionValue
                  ];
                } else {
                  relevantOptionsConditions.push({
                    variant: 'options',
                    operator: condition.operator,
                    value: condition.value || condition.values[0],
                    target: cq.codeName,
                    conditionalOptions: [condition.optionValue],
                    order: condition.order
                  });
                }
              });

              // Join all recovered conditionals and sort them by order
              conditionsAssociated = [
                ...conditionsAssociated,
                ...relevantConditions,
                ...relevantOptionsConditions
              ].sort((a, b) => a.order - b.order);
            });

            // Transform questions into target options for conditionals
            let targetOptions = Array.from(
              currentSurvey.surveyEconomicQuestions
            ).map((question, index) => ({
              value: question.codeName,
              label: question.questionText,
              order: index + 1,
              optionKeys: question.options
            }));
            //Remove previus questions form possible target options
            targetOptions.splice(0, question.orderNumber);

            return (
              <Conditionals
                order={index + 1}
                key={question.codeName}
                question={question}
                relatedConditions={conditionsAssociated}
                targetOptions={targetOptions}
                updateConditions={updateConditions}
                deleteCondition={deleteCondition}
              />
            );
          })}
      {(!selectedSurveyTopic ||
        currentSurvey.surveyEconomicQuestions.filter(
          q => q.topic === selectedSurveyTopic.text
        ).length === 0) && (
        <div className={classes.placeHolder}>
          <Typography variant="h6">
            {t('views.surveyBuilder.economic.dropHere')}
          </Typography>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = ({ user, currentSurvey }) => ({ user, currentSurvey });

const mapDispatchToProps = { updateSurvey };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EconomicConditionals);
