import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { withSnackbar } from 'notistack';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core';
import * as moment from 'moment';
import InputWithFormik from '../../components/InputWithFormik';
import AutocompleteWithFormik from '../../components/AutocompleteWithFormik';
import DatePickerWithFormik from '../../components/DatePickerWithFormik';
import { updateDraft } from '../../redux/actions';
import InputWithDep from '../../components/InputWithDep';
import {
  getDraftWithUpdatedMember,
  getDraftWithUpdatedQuestionsCascading
} from '../../utils/conditional-logic';

const FamilyMemberForm = ({ classes, syncDraft, t, i18n: { language } }) => {
  //export class FamilyProfile extends Component {

  return (
    <div key={index} className={classes.familyMemberForm}>
      <Typography variant="h6" className={classes.title}>
        <i className={`material-icons ${classes.icon}`}>face</i>
        {t('views.family.familyMember')} {index + 2}
      </Typography>
      <InputWithFormik
        label={t('views.family.firstName')}
        name={`members[${index}].firstName`}
        required
        onChange={e =>
          syncDraft(
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
          syncDraft(
            e ? e.value : '',
            index,
            'gender',
            `members[${index}].gender`,
            setFieldValue
          )
        }
      />
      <InputWithDep
        dep="gender"
        from={currentDraft}
        fieldOptions={surveyConfig.gender}
        index={index + 1}
        target={`members[${index}].customGender`}
        cleanUp={() =>
          syncDraft(
            '',
            index,
            'customGender',
            `members[${index}].customGender`,
            setFieldValue
          )
        }
      >
        {(otherOption, value) =>
          otherOption === value && (
            <InputWithFormik
              label={`${t('views.family.specify')} ${t(
                'views.family.gender'
              ).toLowerCase()}`}
              name={`members[${index}].customGender`}
              onChange={e =>
                syncDraft(
                  e.target.value,
                  index,
                  'customGender',
                  `members[${index}].customGender`,
                  setFieldValue
                )
              }
            />
          )
        }
      </InputWithDep>
      <DatePickerWithFormik
        label={t('views.family.dateOfBirth')}
        name={`members[${index}].birthDate`}
        maxDate={new Date()}
        disableFuture
        minDate={moment('1910-01-01')}
        onChange={e =>
          syncDraft(
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
};

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
  buttonAddForm: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 40
  }
});
const mapStateToProps = ({ user }) => ({ user });

const mapDispatchToProps = { updateSurvey, updateDraft };

export default withRouter(
  withStyles(styles)(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(withTranslation()(withSnackbar(FamilyProfile)))
  )
);
