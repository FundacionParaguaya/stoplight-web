import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import { withSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { updateFamilyProject } from '../../../api';
import ConfirmationModal from '../../../components/ConfirmationModal';
import ProjectSelector from '../../../components/selectors/ProjectsSelector';
import { ROLE_APP_ADMIN } from '../../../utils/role-utils';
import { useWindowSize } from '../../../utils/hooks-helpers';

const useStyles = makeStyles(theme => ({
  projectSelectorContainer: {
    marginBottom: theme.spacing(2)
  },
  button: {
    marginLeft: '2rem',
    [theme.breakpoints.down('sm')]: {
      margin: 0,
      display: 'flex',
      justifyContent: 'flex-end'
    }
  }
}));

const ChangeProject = ({
  familyId,
  currentProject,
  enqueueSnackbar,
  closeSnackbar,
  user
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const display = user.role === ROLE_APP_ADMIN;
  const windowSize = useWindowSize();
  const stackSelector = windowSize.width < 600;

  const [openConfirmationModal, setConfirmationModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [changedProject, setChangedProject] = useState(false);
  const [projectData, setProjectData] = useState();

  useEffect(() => {
    !!currentProject &&
      setProjectData({ value: currentProject.id, label: currentProject.title });
  }, [currentProject]);

  const toggleConfirmationModal = () =>
    setConfirmationModal(!openConfirmationModal);

  const confirmAction = () => {
    setLoading(true);
    updateFamilyProject(familyId, projectData.value, user)
      .then(() => {
        setLoading(false);
        setChangedProject(false);
        setConfirmationModal(false);
        enqueueSnackbar(t('views.familyProfile.project.assignedCorrectly'), {
          variant: 'success',
          action: key => (
            <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
              <CloseIcon style={{ color: 'white' }} />
            </IconButton>
          )
        });
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
        setConfirmationModal(false);
        enqueueSnackbar(t('views.familyProfile.project.assignError'), {
          variant: 'error',
          action: key => (
            <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
              <CloseIcon style={{ color: 'white' }} />
            </IconButton>
          )
        });
      });
  };

  return (
    <React.Fragment>
      {display && (
        <React.Fragment>
          <Grid
            container
            spacing={2}
            className={classes.projectSelectorContainer}
          >
            <Grid item md={6} sm={6} xs={12}>
              <ProjectSelector
                withTitle={true}
                projectData={projectData}
                onChangeProject={selected => {
                  setChangedProject(true);
                  setProjectData(selected);
                }}
                isMulti={false}
                isClearable={true}
                stacked={stackSelector}
              />
            </Grid>
            <Grid item md={4} sm={5} xs={12} className={classes.button}>
              <Button
                variant="contained"
                onClick={toggleConfirmationModal}
                disabled={!changedProject || !projectData}
              >
                {t('views.familyProfile.project.changeProject')}
              </Button>
            </Grid>
          </Grid>
          <ConfirmationModal
            title={t('views.familyProfile.project.changeProject')}
            subtitle={t('views.familyProfile.project.changeProjectConfirm')}
            cancelButtonText={t('general.no')}
            continueButtonText={t('general.yes')}
            onClose={toggleConfirmationModal}
            disabledFacilitator={loading}
            open={openConfirmationModal}
            confirmAction={confirmAction}
          />
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(withSnackbar(ChangeProject));
