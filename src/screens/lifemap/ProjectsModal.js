import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton, Modal, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@material-ui/icons/Close';
import ProjectsCarousel from './ProjectsCarousel';
import Button from '@material-ui/core/Button';

const ProjectsModal = ({
  afterSelect,
  open,
  toggleModal,
  projects,
  selectedSurvey
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const onClose = (selected, project) => {
    const s = selectedSurvey;
    selected && afterSelect(s, project);
    toggleModal();
  };

  return (
    <Modal
      disableEnforceFocus
      disableAutoFocus
      open={open}
      onClose={() => onClose(false)}
      className={classes.modal}
    >
      <div className={classes.container}>
        <Typography className={classes.title} variant="h5" align="center">
          {t('views.survey.chooseSurvey')}
        </Typography>
        <IconButton
          className={classes.closeIcon}
          key="dismiss"
          onClick={() => {
            onClose(false);
          }}
        >
          <CloseIcon style={{ color: 'green' }} />
        </IconButton>
        <Typography align="center" variant="subtitle1">
          {t('views.survey.chooseProject')}
        </Typography>
        <ProjectsCarousel projects={projects} handleClick={onClose} />
        <Button
          style={{
            textDecoration: 'none',
            padding: 0,
            position: 'absolute',
            bottom: 20,
            right: 100
          }}
          onClick={() => onClose(true)}
        >
          {t('views.survey.skipProject')}
        </Button>
      </div>
    </Modal>
  );
};

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    paddingTop: '2em',
    paddingBottom: '2em',
    paddingRight: '1em',
    paddingLeft: '1em',
    backgroundColor: theme.palette.background.default,
    outline: 'none',
    width: '1100px',
    minWidth: '900px',
    maxHeight: '65vh',
    minHeight: '45vh',
    position: 'relative'
  },
  title: {
    paddingBottom: 15
  },
  closeIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    marginBottom: 15
  }
}));

export default ProjectsModal;
