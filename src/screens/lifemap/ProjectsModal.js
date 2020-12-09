import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton, Modal, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import ProjectsCarousel from './ProjectsCarousel';

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
    width: '80vw',
    minWidth: '80vw',
    maxHeight: '65vh',
    minHeight: '45vh',
    position: 'relative',
    [theme.breakpoints.down('xs')]: {
      maxHeight: '85vh'
    }
  },
  title: {
    marginTop: 20,
    paddingBottom: 5
  },
  closeIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    marginBottom: 15
  },
  skipProjectButton: {
    textDecoration: 'none',
    padding: 0,
    position: 'absolute',
    bottom: 20,
    [theme.breakpoints.down('xs')]: {
      bottom: 15
    },
    right: 100
  }
}));

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
          {t('views.survey.chooseProjectTitle')}
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
          {t('views.survey.chooseProjectSubtitle')}
        </Typography>
        <ProjectsCarousel projects={projects} handleClick={onClose} />
        <Button
          className={classes.skipProjectButton}
          onClick={() => onClose(true)}
        >
          {t('views.survey.skipProject')}
        </Button>
      </div>
    </Modal>
  );
};

export default ProjectsModal;
