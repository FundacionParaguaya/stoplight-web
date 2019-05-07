import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { DatePicker } from 'material-ui-pickers';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core';
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import * as moment from 'moment';
import * as _ from 'lodash';
import { getErrorLabelForPath, pathHasError } from '../../utils/form-utils';
import { updateDraft } from '../../redux/actions';
import TitleBar from '../../components/TitleBar';
import Autocomplete from '../../components/Autocomplete';
import Container from '../../components/Container';
import BottomSpacer from '../../components/BottomSpacer';

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
    const { currentDraft } = this.props;

    // update only the family member that is edited
    this.props.updateDraft({
      ...currentDraft,
      familyData: {
        ...currentDraft.familyData,
        familyMembersList: currentDraft.familyData.familyMembersList.map(
          (item, index) => {
            if (memberIndex - 1 === index) {
              return {
                ...item,
                [property]: value
              };
            }
            return item;
          }
        )
      }
    });
  };

  handleContinue = () => {
    this.props.history.push('/lifemap/location');
  };

  render() {
    const { classes, t, currentDraft, currentSurvey } = this.props;
    const membersList = currentDraft.familyData.familyMembersList.slice(0);
    const { surveyConfig } = currentSurvey;
    return (
      <div>
        <TitleBar title={t('views.familyMembers')} />
        <Container variant="slim">
          <Formik
            enableReinitialize
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
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              isSubmitting,
              setFieldValue,
              setFieldTouched,
              validateForm
            }) => (
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
                            <TextField
                              className={
                                _.get(values, `members.[${index}].firstName`)
                                  ? `${this.props.classes.input} ${
                                      this.props.classes.inputFilled
                                    }`
                                  : `${this.props.classes.input}`
                              }
                              variant="filled"
                              label={t('views.family.firstName')}
                              name={`members[${index}].firstName`}
                              value={item.firstName}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={pathHasError(
                                `members[${index}].firstName`,
                                touched,
                                errors
                              )}
                              helperText={getErrorLabelForPath(
                                `members[${index}].firstName`,
                                touched,
                                errors,
                                t
                              )}
                              fullWidth
                              required
                            />
                            <Autocomplete
                              name={`members[${index}].gender`}
                              value={{
                                value: item.gender,
                                label: item.gender
                                  ? surveyConfig.gender.find(
                                      e => e.value === item.gender
                                    ).text
                                  : ''
                              }}
                              options={surveyConfig.gender.map(e => ({
                                value: e.value,
                                label: e.text
                              }))}
                              onChange={value => {
                                setFieldValue(
                                  `members[${index}].gender`,
                                  value ? value.value : ''
                                );
                              }}
                              onBlur={() =>
                                setFieldTouched(`members[${index}].gender`)
                              }
                              textFieldProps={{
                                label: t('views.family.selectGender'),
                                error: pathHasError(
                                  `members[${index}].gender`,
                                  touched,
                                  errors
                                ),
                                helperText: getErrorLabelForPath(
                                  `members[${index}].gender`,
                                  touched,
                                  errors,
                                  t
                                )
                              }}
                            />
                            <DatePicker
                              format="MM/DD/YYYY"
                              label={t('views.family.dateOfBirth')}
                              name={`members[${index}].birthDate`}
                              value={
                                item.birthDate
                                  ? moment.unix(item.birthDate)
                                  : null
                              }
                              onChange={e =>
                                setFieldValue(
                                  `members[${index}].birthDate`,
                                  e.unix()
                                )
                              }
                              onClose={() =>
                                setFieldTouched(`members[${index}].birthDate`)
                              }
                              error={pathHasError(
                                `members[${index}].birthDate`,
                                touched,
                                errors
                              )}
                              helperText={getErrorLabelForPath(
                                `members[${index}].birthDate`,
                                touched,
                                errors,
                                t
                              )}
                              TextFieldComponent={textFieldProps => (
                                <TextField
                                  className={
                                    item.birthDate
                                      ? `${this.props.classes.input} ${
                                          this.props.classes.inputFilled
                                        }`
                                      : `${this.props.classes.input}`
                                  }
                                  variant="filled"
                                  {...textFieldProps}
                                />
                              )}
                              fullWidth
                              disableFuture
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
                          console.log(validationErrors);
                          // TODO show something, there are some validation errors
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
  },
  input: {
    marginTop: 10,
    marginBottom: 10
  },
  inputFilled: {
    '& $div': {
      backgroundColor: '#fff!important'
    }
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
  )(withTranslation()(FamilyMembers))
);
