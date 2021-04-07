import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import { withSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { assignFacilitator } from '../../../api';
import ConfirmationModal from '../../../components/ConfirmationModal';
import FacilitatorFilter from '../../../components/FacilitatorFilter';
import { ROLE_APP_ADMIN, ROLE_ROOT } from '../../../utils/role-utils';
import { useWindowSize } from '../../../utils/hooks-helpers';

const useStyles = makeStyles(theme => ({
  facilitatorSelectorContainer: {
    marginTop: theme.spacing(2),
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

const ChangeFacilitator = ({
  familyId,
  currentFacilitator,
  orgsId,
  enqueueSnackbar,
  closeSnackbar,
  user
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const canChangeFacilitator =
    user.role === ROLE_APP_ADMIN || user.role === ROLE_ROOT;
  const windowSize = useWindowSize();
  const stackSelector = windowSize.width < 600;

  const [openConfirmationModal, setConfirmationModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [changedFacilitator, setChangedFacilitator] = useState(false);
  const [facilitatorData, setFacilitatorData] = useState();

  useEffect(() => {
    !!currentFacilitator && setFacilitatorData(currentFacilitator);
  }, [currentFacilitator]);

  const toggleConfirmationModal = () =>
    setConfirmationModal(!openConfirmationModal);

  const confirmAction = () => {
    setLoading(true);
    assignFacilitator(familyId, facilitatorData.value, user)
      .then(() => {
        setLoading(false);
        setChangedFacilitator(false);
        setConfirmationModal(false);
        enqueueSnackbar(t('views.familyProfile.Mentorsuccess'), {
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
        enqueueSnackbar(t('views.familyProfile.mentorError'), {
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
      <Grid
        container
        spacing={2}
        className={classes.facilitatorSelectorContainer}
      >
        <Grid item md={6} sm={12} xs={12}>
          {!!orgsId && (
            <FacilitatorFilter
              data={facilitatorData}
              organizations={!!orgsId ? orgsId : null}
              isMulti={false}
              onChange={selected => {
                setChangedFacilitator(true);
                setFacilitatorData(selected);
              }}
              label={t('views.familyProfile.facilitator')}
              stacked={stackSelector}
              isDisabled={!canChangeFacilitator}
            />
          )}
        </Grid>
        {canChangeFacilitator && (
          <Grid item md={4} sm={12} xs={12} className={classes.button}>
            <Button
              color="primary"
              variant="contained"
              onClick={toggleConfirmationModal}
              disabled={!changedFacilitator || !facilitatorData}
            >
              {t('views.familyProfile.changeFacilitator')}
            </Button>
          </Grid>
        )}
      </Grid>
      <ConfirmationModal
        title={t('views.familyProfile.changeFacilitator')}
        subtitle={t('views.familyProfile.changeFacilitatorConfirm')}
        cancelButtonText={t('general.no')}
        continueButtonText={t('general.yes')}
        onClose={toggleConfirmationModal}
        disabledFacilitator={loading}
        open={openConfirmationModal}
        confirmAction={confirmAction}
      />
    </React.Fragment>
  );
};

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(withSnackbar(ChangeFacilitator));
