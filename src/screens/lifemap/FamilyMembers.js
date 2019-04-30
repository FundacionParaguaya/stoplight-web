import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core';
import { updateDraft } from '../../redux/actions';
import TitleBar from '../../components/TitleBar';
import Form from '../../components/Form';
import Input from '../../components/Input';
import Container from '../../components/Container';
import Select from '../../components/Select';
import BottomSpacer from '../../components/BottomSpacer';
import DatePicker from '../../components/DatePicker';

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
          <Form
            onSubmit={this.handleContinue}
            submitLabel={t('general.continue')}
          >
            {membersList.map((item, index) => {
              if (index === 0) {
                return (
                  <div key={index}>
                    <Typography variant="h6" className={classes.title}>
                      <i className={`material-icons ${classes.icon}`}>face</i>
                      {t('views.family.familyMember')} {index + 1} -{' '}
                      {t('views.primaryParticipant')}
                    </Typography>
                    <TextField
                      disabled
                      field={index + 1}
                      label={`${t('views.family.firstName')}`}
                      value={item.firstName}
                      margin="dense"
                      fullWidth
                    />

                    <Select
                      disabled
                      label={t('views.family.selectGender')}
                      value={item.gender}
                      field={index + 1}
                      onChange={(i, value) =>
                        this.updateDraft(i, value, 'gender')
                      }
                      options={surveyConfig.gender}
                    />
                    <DatePicker
                      disabled
                      label={t('views.family.dateOfBirth')}
                      field={index + 1}
                      onChange={(j, value) =>
                        this.updateDraft(j, value, 'birthDate')
                      }
                      value={item.birthDate}
                    />
                  </div>
                );
              }
              return (
                <div key={index} className={classes.familyMemberForm}>
                  <Typography variant="h6" className={classes.title}>
                    <i className={`material-icons ${classes.icon}`}>face</i>
                    {t('views.family.familyMember')} {index + 1}
                  </Typography>
                  <Input
                    required
                    field={index + 1}
                    label={`${t('views.family.firstName')}`}
                    value={item.firstName}
                    onChange={(k, value) =>
                      this.updateDraft(k, value, 'firstName')
                    }
                  />

                  <Select
                    label={t('views.family.selectGender')}
                    value={item.gender}
                    field={index + 1}
                    onChange={(l, value) =>
                      this.updateDraft(l, value, 'gender')
                    }
                    options={surveyConfig.gender}
                  />
                  <DatePicker
                    label={t('views.family.dateOfBirth')}
                    field={index + 1}
                    onChange={(m, value) =>
                      this.updateDraft(m, value, 'birthDate')
                    }
                    value={item.birthDate}
                  />
                </div>
              );
            })}
          </Form>
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
