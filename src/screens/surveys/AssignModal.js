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
import { getHubs, getOrganizationsByHub, assignOrganizations } from '../../api';
import { CircularProgress } from '@material-ui/core';

const selectStyle = {
  control: (styles, { isFocused }) => ({
    ...styles,
    backgroundColor: '#FFFFFF;',
    borderRadius: 2,
    '&:hover': { borderColor: isFocused ? '#309E43' : 'hsl(0, 0%, 70%)' },
    border: isFocused ? '1.5px solid #309E43' : '1.5px solid #DCDEE3',
    boxShadow: isFocused ? '0 0 0 1px #309E43' : 'none'
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
    width: '37%',
    minWidth: 375,
    height: '33%'
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
  updateSurveys
}) => {
  const [loading, setLoading] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [applications, setApplications] = useState([]);
  const [hubs, setHubs] = useState([]);
  const [orgs, setOrgs] = useState([]);

  useEffect(() => {
    return () => {
      updateSurveys(survey.id, applications, organizations);
    };
  }, []);

  useEffect(() => {
    if (!!survey.title) {
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
      getHubs(user).then(response => {
        const hubsFromAPI = _.get(response, 'data.data.hubsByUser', []).map(
          hub => ({
            label: hub.name,
            value: hub.id
          })
        );
        setHubs(hubsFromAPI);
      });
      let hub = { value: 1 };
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
    }
  }, [survey]);

  const showHubs = () => {
    return user.role === ROLES_NAMES.ROLE_ROOT;
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
    assignOrganizations(
      user,
      newSurveyOrganizations,
      newSurveyHubs,
      survey.id
    ).finally(() => {
      updateSurveys(survey.id, applications, organizations);
      setLoading(false);
      toggleModal();
    });
  };

  return (
    <React.Fragment>
      <Modal open={open} onClose={() => toggleModal()}>
        {loading ? (
          <div className={classes.confirmationModal}>
            <CircularProgress />
          </div>
        ) : (
          <div className={classes.confirmationModal}>
            <IconButton
              className={classes.closeIcon}
              key="dismiss"
              onClick={() => toggleModal()}
            >
              <CloseIcon style={{ color: 'green' }} />
            </IconButton>
            <Typography style={{ marginBottom: 30 }} variant="h5">
              {t('views.survey.assignSurvey')}
            </Typography>
            <Typography variant="h6" className={classes.surveyTitle}>
              {survey.title}
            </Typography>
            {showHubs() && (
              <div className={classes.container}>
                <Typography variant="subtitle1" className={classes.label}>
                  {t('views.survey.hubs')}
                </Typography>
                <div className={classes.selector}>
                  <Select
                    value={applications}
                    onChange={value => setApplications(value)}
                    placeholder=""
                    isLoading={loading}
                    loadingMessage={() => t('views.hubsFilter.loading')}
                    noOptionsMessage={() => t('views.hubsFilter.noOption')}
                    options={hubs}
                    components={{
                      DropdownIndicator: () => <div />,
                      IndicatorSeparator: () => <div />
                    }}
                    isClearable
                    isMulti
                    hideSelectedOptions
                    styles={selectStyle}
                  />
                </div>
              </div>
            )}

            {showOrganizations() && (
              <div className={classes.container}>
                <Typography variant="subtitle1" className={classes.label}>
                  {t('views.organizationsFilter.label')}
                </Typography>

                <div className={classes.selector}>
                  <Select
                    value={organizations}
                    onChange={value => setOrganizations(value)}
                    placeholder=""
                    isLoading={loading}
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

            <Button
              variant="contained"
              color="primary"
              onClick={() => handleSubmit()}
            >
              {t('general.ok')}
            </Button>
          </div>
        )}
      </Modal>
    </React.Fragment>
  );
};

const mapStateToProps = ({ user }) => ({ user });

export default withRouter(
  withStyles(styles)(connect(mapStateToProps)(withTranslation()(AssignModal)))
);
