import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { withSnackbar } from 'notistack';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core';
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import * as moment from 'moment';
import InputWithFormik from '../../components/InputWithFormik';
import AutocompleteWithFormik from '../../components/AutocompleteWithFormik';
import DatePickerWithFormik from '../../components/DatePickerWithFormik';
import { updateDraft } from '../../redux/actions';
import TitleBar from '../../components/TitleBar';
import Container from '../../components/Container';
import BottomSpacer from '../../components/BottomSpacer';
import { withScroller } from '../../components/Scroller';
import { shouldCleanUp } from '../../utils/conditional-logic';

const fieldIsRequired = 'validation.fieldIsRequired';
const schemaWithDateTransform = Yup.date()
  .typeError(fieldIsRequired)
  .transform((_value, originalValue) => {
    return originalValue ? moment.unix(originalValue).toDate() : new Date();
  });

const validationSchema = Yup.object().shape({
  members: Yup.array().of(
    Yup.object().shape({
      firstName: Yup.string().required(fieldIsRequired),
      birthDate: schemaWithDateTransform
    })
  )
});

export class FamilyMembers extends Component {
  updateDraft = (memberIndex, value, property) => {
    const { currentDraft, currentSurvey } = this.props;
    const { conditionalQuestions = [] } = currentSurvey;

    const newDraft = {
      ...currentDraft,
      familyData: {
        ...currentDraft.familyData,
        familyMembersList: currentDraft.familyData.familyMembersList.map(
          (item, index) => {
            if (memberIndex === index) {
              return {
                ...item,
                [property]: value
              };
            }
            return item;
          }
        )
      }
    };

    conditionalQuestions
      .filter(question => question.forFamilyMember)
      .forEach(question => {
        // We may need to cleanup some conditionalQuestions
        if (
          shouldCleanUp(
            question,
            newDraft,
            newDraft.familyData.familyMembersList[memberIndex],
            memberIndex
          )
        ) {
          console.log(
            `Cleaning up conditional question ${
              question.codeName
            } for Member at index ${memberIndex}`
          );
          const {
            socioEconomicAnswers = []
          } = newDraft.familyData.familyMembersList[memberIndex];
          socioEconomicAnswers.find(ea => ea.key === question.codeName).value =
            '';
        }
      });

    // update only the family member that is edited
    this.props.updateDraft(newDraft);
  };

  handleContinue = () => {
    this.props.history.push('/lifemap/location');
  };

  syncDraft = (value, index, keyInDraft, keyInFormik, setFieldValue) => {
    setFieldValue(keyInFormik, value);
    this.updateDraft(index + 1, value, keyInDraft);
  };

  render() {
    const {
      classes,
      t,
      currentDraft,
      currentSurvey,
      scrollToTop,
      enqueueSnackbar,
      closeSnackbar
    } = this.props;
    const membersList = currentDraft.familyData.familyMembersList.slice(0);
    const { surveyConfig } = currentSurvey;
    return (
      <div>
        <TitleBar title={t('views.familyMembers')} />
        <Container variant="slim">
          <Formik
            initialValues={{
              members: membersList.filter(item => !item.firstParticipant)
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
              this.props.updateDraft({
                ...currentDraft,
                familyData: {
                  ...currentDraft.familyData,
                  familyMembersList: [
                    {
                      ...currentDraft.familyData.familyMembersList[0]
                    },
                    ...values.members
                  ]
                }
              });
              this.handleContinue();
              setSubmitting(false);
            }}
          >
            {({ values, isSubmitting, setFieldValue, validateForm }) => (
              <Form noValidate>
                <FieldArray
                  name="members"
                  render={() => (
                    <React.Fragment>
                      {values.members.map((item, index) => {
                        return (
                          <div key={index} className={classes.familyMemberForm}>
                            <Typography variant="h6" className={classes.title}>
                              <i className={`material-icons ${classes.icon}`}>
                                face
                              </i>
                              {t('views.family.familyMember')} {index + 1}
                            </Typography>
                            <InputWithFormik
                              label={t('views.family.firstName')}
                              name={`members[${index}].firstName`}
                              required
                              onChange={e =>
                                this.syncDraft(
                                  e.target.value,
                                  index,
                                  'firstName',
                                  `members[${index}].firstName`,
                                  setFieldValue
                                )
                              }
                            />
                            <AutocompleteWithFormik
                              label={t('views.family.selectGender')}
                              name={`members[${index}].gender`}
                              rawOptions={surveyConfig.gender}
                              labelKey="text"
                              valueKey="value"
                              onChange={e =>
                                this.syncDraft(
                                  e ? e.value : '',
                                  index,
                                  'gender',
                                  `members[${index}].gender`,
                                  setFieldValue
                                )
                              }
                            />
                            <DatePickerWithFormik
                              label={t('views.family.dateOfBirth')}
                              name={`members[${index}].birthDate`}
                              disableFuture
                              minDate={moment('1910-01-01')}
                              onChange={e =>
                                this.syncDraft(
                                  e.unix(),
                                  index,
                                  'birthDate',
                                  `members[${index}].birthDate`,
                                  setFieldValue
                                )
                              }
                            />
                          </div>
                        );
                      })}
                    </React.Fragment>
                  )}
                />
                <div className={classes.buttonContainerForm}>
                  <Button
                    type="submit"
                    color="primary"
                    variant="contained"
                    disabled={isSubmitting}
                    onClick={() => {
                      validateForm().then(validationErrors => {
                        if (Object.keys(validationErrors).length > 0) {
                          const errorsLength = Object.keys(
                            validationErrors.members
                          ).length;
                          if (errorsLength > 0) {
                            enqueueSnackbar(
                              t('views.family.formWithErrors').replace(
                                '%number',
                                errorsLength
                              ),
                              {
                                variant: 'error',
                                action: key => (
                                  <IconButton
                                    key="dismiss"
                                    onClick={() => closeSnackbar(key)}
                                  >
                                    <CloseIcon style={{ color: 'white' }} />
                                  </IconButton>
                                )
                              }
                            );
                            scrollToTop();
                          }
                        }
                      });
                    }}
                  >
                    {t('general.continue')}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Container>
        <BottomSpacer />
      </div>
    );
  }
}

const styles = theme => ({
  title: {
    display: 'flex',
    alignItems: 'center'
  },
  icon: {
    marginRight: 10,
    fontSize: 30,
    color: theme.palette.grey.main
  },
  familyMemberForm: {
    marginTop: 40
  },
  buttonContainerForm: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 40
  }
});

const mapStateToProps = ({ currentSurvey, currentDraft }) => ({
  currentSurvey,
  currentDraft
});

const mapDispatchToProps = { updateDraft };

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withTranslation()(withScroller(withSnackbar(FamilyMembers))))
);
