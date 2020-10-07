import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import { FieldArray, Form, Formik } from 'formik';
import * as moment from 'moment';
import { withSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Prompt } from 'react-router';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { getFamily, getSurveyById, updateFamilyDetails } from '../../../api';
import familyFaceIcon from '../../../assets/family_face_large.png';
import AutocompleteWithFormik from '../../../components/AutocompleteWithFormik';
import BottomSpacer from '../../../components/BottomSpacer';
import Container from '../../../components/Container';
import DatePickerWithFormik from '../../../components/DatePickerWithFormik';
import ExitModal from '../../../components/ExitModal';
import InputWithFormik from '../../../components/InputWithFormik';
import withLayout from '../../../components/withLayout';

const useStyles = makeStyles(theme => ({
  topImageContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2)
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  buttonContainerForm: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 40
  }
}));

const fieldIsRequired = 'validation.fieldIsRequired';
const validDate = 'validation.validDate';
const minDate = '1910-01-01';
const schemaWithDateTransform = Yup.mixed()
  .transform((_value, originalValue) => {
    let birthDate = !!originalValue
      ? moment.unix(originalValue).toDate()
      : new Date('');

    if (birthDate > new Date()) return null;
    if (birthDate < new Date(minDate)) return null;

    return birthDate;
  })
  .required(validDate);

const validationSchema = Yup.object().shape({
  members: Yup.array().of(
    Yup.object().shape({
      firstName: Yup.string().required(fieldIsRequired),
      birthDate: schemaWithDateTransform
    })
  )
});

const EditFamilyMembersForm = ({
  user,
  enqueueSnackbar,
  closeSnackbar,
  history
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { familyId } = useParams();

  const [loading, setLoading] = useState();
  const [familyMembers, setFamilyMembers] = useState([]);
  const [primaryParticipant, setPrimaryParticipant] = useState({});
  const [surveyConfig, setSurveyConfig] = useState({
    gender: [],
    documentType: []
  });
  const [otherGenderValue, setOtherGenderValue] = useState();
  const [openExitModal, setOpenExitModal] = useState(false);

  const handleSubmit = values => {
    setLoading(true);
    updateFamilyDetails(user, familyId, [...values.members, primaryParticipant])
      .then(() => {
        enqueueSnackbar(t('views.familyProfile.form.save.success'), {
          variant: 'success',
          action: key => (
            <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
              <CloseIcon style={{ color: 'white' }} />
            </IconButton>
          )
        });
        history.push(`/family/${familyId}`);
      })
      .catch(e => {
        console.log(e);
        enqueueSnackbar(t('views.familyProfile.form.save.failed'), {
          variant: 'error',
          action: key => (
            <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
              <CloseIcon style={{ color: 'white' }} />
            </IconButton>
          )
        });
      });
  };

  useEffect(() => {
    setLoading(true);
    getFamily(familyId, user)
      .then(response => {
        let family = response.data.data.familyById;
        let familyMembers = family.familyMemberDTOList.filter(
          element => element.firstParticipant !== true
        );
        setFamilyMembers(familyMembers);

        let primaryParticipant = family.familyMemberDTOList.find(
          element => element.firstParticipant
        );
        setPrimaryParticipant(primaryParticipant);

        getSurveyById(user, family.snapshotIndicators.surveyId).then(
          response => {
            let surveyConfig = response.data.data.surveyById.surveyConfig;
            setSurveyConfig(surveyConfig);

            let otherGender = surveyConfig.gender.find(g => g.otherOption);
            setOtherGenderValue(!!otherGender && otherGender.value);

            setLoading(false);
          }
        );
      })
      .catch(e => {
        console.log(e);
        setLoading(false);
      });
  }, [familyId]);

  return (
    <React.Fragment>
      {loading ? (
        <div className={classes.loadingContainer}>
          <CircularProgress />
        </div>
      ) : (
        <React.Fragment>
          <ExitModal
            open={openExitModal}
            onDissmiss={() => setOpenExitModal(false)}
            onClose={() => history.push(`/family/${familyId}`)}
          />
          <Prompt
            when={!openExitModal && !loading}
            message={t('views.exitModal.confirmText')}
          />

          <div className={classes.topImageContainer}>
            <img alt="" height={60} width={60} src={familyFaceIcon} />
          </div>
          <Container variant="slim">
            <Formik
              initialValues={{
                members: familyMembers
              }}
              validationSchema={validationSchema}
              onSubmit={values => {
                handleSubmit(values);
              }}
            >
              {({ values, isSubmitting, setFieldValue, validateForm }) => (
                <Form noValidate>
                  <FieldArray
                    name="members"
                    render={arrayHelpers => (
                      <React.Fragment>
                        {values.members.map((item, index) => {
                          //It's index + 2  to make it clear that no family member it's  the first participant
                          return (
                            <div
                              key={index}
                              className={classes.familyMemberForm}
                            >
                              <div className={classes.familyMemberTitle}>
                                <Typography
                                  variant="h6"
                                  className={classes.title}
                                >
                                  <i
                                    className={`material-icons ${classes.icon}`}
                                  >
                                    face
                                  </i>
                                  {t('views.family.familyMember')} {index + 2}
                                </Typography>
                              </div>

                              <InputWithFormik
                                label={t('views.family.firstName')}
                                name={`members[${index}].firstName`}
                                required
                              />
                              <AutocompleteWithFormik
                                label={t('views.family.selectGender')}
                                name={`members[${index}].gender`}
                                rawOptions={surveyConfig.gender}
                                labelKey="text"
                                valueKey="value"
                              />
                              {values.members[index].gender ===
                                otherGenderValue && (
                                <InputWithFormik
                                  label={`${t('views.family.specify')} ${t(
                                    'views.family.gender'
                                  ).toLowerCase()}`}
                                  name="customGender"
                                  required
                                />
                              )}
                              <DatePickerWithFormik
                                label={t('views.family.dateOfBirth')}
                                name={`members[${index}].birthDate`}
                                maxDate={new Date()}
                                disableFuture
                                minDate={moment(minDate)}
                                onChange={e => {
                                  !!e &&
                                    e._isValid &&
                                    setFieldValue(
                                      `members[${index}].birthDate`,
                                      e.unix()
                                    );
                                }}
                              />
                            </div>
                          );
                        })}
                      </React.Fragment>
                    )}
                  />

                  <div className={classes.buttonContainerForm}>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setOpenExitModal(true);
                      }}
                      disabled={isSubmitting}
                    >
                      {t('general.cancel')}
                    </Button>
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
                                errorsLength === 1
                                  ? t('views.family.formWithError')
                                  : t('views.family.formWithErrors').replace(
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
                            }
                          }
                        });
                      }}
                    >
                      {t('general.save')}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
            <BottomSpacer />
          </Container>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

const mapStateToProps = ({ user }) => ({
  user
});

export default connect(mapStateToProps)(
  withSnackbar(withLayout(EditFamilyMembersForm))
);
