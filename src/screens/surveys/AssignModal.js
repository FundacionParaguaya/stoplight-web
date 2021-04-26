import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import CloseIcon from '@material-ui/icons/Close';
import { ROLES_NAMES } from '../../utils/role-utils';
import {
  withStyles,
  Modal,
  Typography,
  Button,
  IconButton
} from '@material-ui/core';
import Select from 'react-select';
import * as _ from 'lodash';
import { withSnackbar } from 'notistack';
import { getHubs, getOrganizationsByHub, assignOrganizations } from '../../api';
import { CircularProgress } from '@material-ui/core';

const selectStyle = {
  control: (styles, { isFocused }) => ({
    ...styles,
    backgroundColor: '#FFFFFF;',
    borderRadius: 2,
    '&:hover': { borderColor: isFocused ? '#309E43' : 'hsl(0, 0%, 70%)' },
    border: isFocused ? '1.5px solid #309E43' : '1.5px solid #DCDEE3',
    boxShadow: isFocused ? '0 0 0 1px #309E43' : 'none',
    scroll: 'auto',
    maxHeight: 300
  }),
  multiValueLabel: styles => ({
    ...styles,
    fontSize: 14,
    fontFamily: 'Poppins',
    fontWeight: 500,
    color: 'rgba(28,33,47,0.51)'
  }),
  multiValue: styles => ({ ...styles, color: 'rgba(28,33,47,0.51)' }),
  option: (styles, { isFocused }) => ({
    ...styles,
    backgroundColor: isFocused ? 'hsl(0,0%,90%)' : 'transparent',
    fontSize: 14,
    fontFamily: 'Poppins'
  }),
  noOptionsMessage: styles => ({
    ...styles,
    fontSize: 16,
    fontFamily: 'Poppins'
  }),
  loadingMessage: styles => ({
    ...styles,
    fontSize: 16,
    fontFamily: 'Poppins'
  })
};

const styles = theme => ({
  surveyTitle: {
    color: theme.palette.primary.dark,
    fontSize: '18px',
    marginRight: 'auto',
    marginBottom: 15,
    fontWeight: theme.typography.fontWeightMedium
  },
  confirmationModal: {
    backgroundColor: theme.palette.background.default,
    outline: 'none',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'column',
    padding: 40,
    width: '85vw',
    maxWidth: 500,
    minHeight: '33%',
    maxHeight: '80vh',
    height: 450
  },
  closeIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    marginBottom: 15
  },
  container: {
    width: '100%',
    marginBottom: 20
  },
  label: {
    marginBottom: 5,
    fontSize: 14
  },
  selector: {
    width: '100%'
  }
});

const AssignModal = ({
  classes,
  t,
  user,
  survey,
  open,
  toggleModal,
  updateSurveys,
  enqueueSnackbar,
  closeSnackbar
}) => {
  const [loading, setLoading] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [applications, setApplications] = useState([]);
  const [hubs, setHubs] = useState([]);
  const [orgs, setOrgs] = useState([]);
  const [optionsLoading, setOptionsLoading] = useState(false);

  useEffect(() => {
    if (!!survey.title) {
      setOptionsLoading(true);
      setInitialValues();
      getHubs(user).then(response => {
        const hubsFromAPI = _.get(response, 'data.data.hubsByUser', []).map(
          hub => ({
            label: hub.name,
            value: hub.id
          })
        );
        setHubs(hubsFromAPI);
      });
      let hub = user.hub;
      getOrganizationsByHub(user, hub && hub.value ? hub.value : null)
        .then(response => {
          const orgs = _.get(response, 'data.data.organizations', []).map(
            org => ({
              label: org.name,
              value: org.id
            })
          );
          setOrgs(orgs);
        })
        .finally(() => setLoading(false));
      setOptionsLoading(false);
    }
  }, [survey.id]);

  const setInitialValues = () => {
    let surveyHubs = survey.applications.map(application => ({
      label: application.name,
      value: application.id
    }));
    setApplications(surveyHubs);
    let surveyOrgs = survey.organizations.map(organization => ({
      label: organization.name,
      value: organization.id
    }));
    setOrganizations(surveyOrgs);
  };

  const showHubs = () => {
    return (
      user.role === ROLES_NAMES.ROLE_ROOT ||
      user.role === ROLES_NAMES.ROLE_PS_TEAM
    );
  };

  const showOrganizations = () => {
    return user.role === ROLES_NAMES.ROLE_HUB_ADMIN;
  };

  const handleSubmit = () => {
    // Organizations or Hubs
    const newSurveyOrganizations = organizations.map(org => {
      return String(org.value);
    });
    const newSurveyHubs = applications.map(application => {
      return String(application.value);
    });
    setLoading(true);
    assignOrganizations(user, newSurveyOrganizations, newSurveyHubs, survey.id)
      .then(() => {
        updateSurveys(survey.id, applications, organizations);
        enqueueSnackbar(t('views.survey.assignSurvey.surveyAssigned'), {
          variant: 'success',
          action: key => (
            <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
              <CloseIcon style={{ color: 'white' }} />
            </IconButton>
          )
        });
        setLoading(false);
      })
      .catch(() => {
        enqueueSnackbar(t('views.survey.assignSurvey.surveyAssignError'), {
          variant: 'error',
          action: key => (
            <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
              <CloseIcon style={{ color: 'white' }} />
            </IconButton>
          )
        });
      })
      .finally(() => {
        setLoading(false);
        toggleModal();
      });
  };

  const handleClosing = () => {
    setInitialValues();
    toggleModal();
  };

  return (
    <React.Fragment>
      <Modal open={open} onClose={() => handleClosing()}>
        {loading ? (
          <div className={classes.confirmationModal}>
            <CircularProgress />
          </div>
        ) : (
          <div className={classes.confirmationModal}>
            <IconButton
              className={classes.closeIcon}
              key="dismiss"
              onClick={() => handleClosing()}
            >
              <CloseIcon style={{ color: 'green' }} />
            </IconButton>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '-webkit-fill-available'
              }}
            >
              <Typography
                style={{ marginBottom: 30, textAlign: 'center' }}
                variant="h5"
              >
                {t('views.survey.assignSurvey.assignSurvey')}
              </Typography>
              <Typography variant="h6" className={classes.surveyTitle}>
                {survey.title}
              </Typography>
              {showHubs() && (
                <div className={classes.container}>
                  <Typography variant="subtitle1" className={classes.label}>
                    {t('views.survey.assignSurvey.hubs')}
                  </Typography>
                  <div className={classes.selector}>
                    <Select
                      value={applications}
                      onChange={value => setApplications(value)}
                      placeholder=""
                      isLoading={optionsLoading}
                      loadingMessage={() => t('views.hubsFilter.loading')}
                      noOptionsMessage={() => t('views.hubsFilter.noOption')}
                      options={hubs}
                      maxMenuHeight={150}
                      components={{
                        DropdownIndicator: () => <div />,
                        IndicatorSeparator: () => <div />,
                        ClearIndicator: () => <div />
                      }}
                      isMulti
                      hideSelectedOptions
                      loading={optionsLoading}
                      styles={selectStyle}
                    />
                  </div>
                </div>
              )}

              {showOrganizations() && (
                <div className={classes.container}>
                  <Typography variant="subtitle1" className={classes.label}>
                    {t('views.survey.assignSurvey.orgs')}
                  </Typography>

                  <div className={classes.selector}>
                    <Select
                      value={organizations}
                      onChange={value => setOrganizations(value)}
                      placeholder=""
                      isLoading={optionsLoading}
                      maxMenuHeight={150}
                      loadingMessage={() =>
                        t('views.organizationsFilter.loading')
                      }
                      noOptionsMessage={() =>
                        t('views.organizationsFilter.noOption')
                      }
                      options={orgs}
                      components={{
                        DropdownIndicator: () => <div />,
                        IndicatorSeparator: () => <div />,
                        ClearIndicator: () => <div />
                      }}
                      closeMenuOnSelect={false}
                      isMulti
                      styles={selectStyle}
                    />
                  </div>
                </div>
              )}
            </div>
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: 5 }}
              onClick={() => handleSubmit()}
            >
              {t('general.save')}
            </Button>
          </div>
        )}
      </Modal>
    </React.Fragment>
  );
};

const mapStateToProps = ({ user }) => ({ user });

export default withRouter(
  withStyles(styles)(
    connect(mapStateToProps)(withTranslation()(withSnackbar(AssignModal)))
  )
);
