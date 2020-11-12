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

const useStyles = makeStyles(theme => ({
  administratorBox: {
    display: 'flex',
    paddingTop: '3%',
    paddingBottom: '3%',
    flexDirection: 'row'
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
          <div className={classes.administratorBox}>
            <Grid item xs={6}>
              <ProjectSelector
                withTitle={true}
                projectData={projectData}
                onChangeProject={selected => {
                  setChangedProject(true);
                  setProjectData(selected);
                }}
                isMulti={false}
                isClearable={true}
                stacked={false}
              />
            </Grid>
            <Grid item xs={5} style={{ marginLeft: '2rem' }}>
              <Button
                variant="contained"
                onClick={toggleConfirmationModal}
                disabled={!changedProject || !projectData}
              >
                {t('views.familyProfile.project.changeProject')}
              </Button>
            </Grid>
          </div>
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
