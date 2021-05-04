import {
  Button,
  CircularProgress,
  IconButton,
  Modal,
  Typography
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { assignIntervention } from '../../api';
import OrganizationSelector from '../../components/selectors/OrganizationSelector';

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalBody: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: 40,
    minHeight: 350,
    maxHeight: '85vh',
    width: '85vw',
    maxWidth: 500,
    overflowY: 'auto',
    position: 'relative',
    outline: 'none'
  },
  closeIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    marginBottom: 15
  },
  buttonContainer: {
    marginTop: 25,
    display: 'flex',
    justifyContent: 'space-evenly'
  }
}));

const AssignInterventionModal = ({
  open,
  intervention,
  showSuccessMessage,
  showErrorMessage,
  onClose,
  user
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [organizations, setOrganizations] = useState([]);

  const onSave = () => {
    setLoading(true);
    let orgs = organizations.map(o => {
      return { id: o.value, name: o.label };
    });
    assignIntervention(user, intervention.id, orgs)
      .then(() => {
        onClose(true, { ...intervention, organizations: orgs });
        showSuccessMessage(t('views.intervention.assign.success'));
      })
      .catch(() => {
        showErrorMessage(t('views.intervention.assign.error'));
      });
    setLoading(false);
  };

  useEffect(() => {
    if (!!intervention) {
      let orgs = intervention.organizations.map(o => {
        return { value: o.id, label: o.name };
      });
      setOrganizations(orgs);
    }
  }, [intervention]);

  return (
    <Modal
      disableEnforceFocus
      disableAutoFocus
      className={classes.modal}
      open={open}
      onClose={() => {
        onClose(false);
      }}
    >
      <div className={classes.modalBody}>
        <IconButton
          className={classes.closeIcon}
          key="dismiss"
          onClick={() => onClose(false)}
        >
          <CloseIcon style={{ color: 'green' }} />
        </IconButton>

        <Typography variant="h5" align="center" style={{ marginBottom: 10 }}>
          {t('views.intervention.assign.title')}
        </Typography>
        <OrganizationSelector
          isMulti
          data={organizations}
          maxMenuHeight="120"
          onChange={value => {
            setOrganizations(value);
          }}
          isClearable={true}
        />

        {loading && <CircularProgress className={classes.loadingContainer} />}

        <div className={classes.buttonContainer}>
          <Button
            className={classes.button}
            onClick={() => onSave()}
            type="submit"
            color="primary"
            variant="contained"
            disabled={loading}
          >
            {t('general.save')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AssignInterventionModal;
