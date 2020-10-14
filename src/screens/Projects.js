import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/styles';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import withLayout from '../components/withLayout';
import { connect } from 'react-redux';
import Container from '../components/Container';
import Typography from '@material-ui/core/Typography';
import ProjectSearchFilter from './projects/ProjectSearchFilter';
import { Grid, Button, CircularProgress } from '@material-ui/core';
import clsx from 'clsx';
import ProjectFormModal from './projects/ProjectFormModal';

const Projects = ({ history, classes, t, user, i18n: { language } }) => {
  const [filter, setFilter] = useState('');
  const [openFormModal, setOpenFormModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState({});
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);

  const onChangeProjectFilter = e => {
    if (e.key == 'Enter') {
      setFilter(e.target.value);
    }
  };

  const toggleFormModal = () => {
    setOpenFormModal(!openFormModal);
  };

  const toggleDeleteModal = () => {
    setOpenDeleteModal(!setOpenDeleteModal);
  };

  const reloadPage = () => {
    loadProjects();
  };

  const loadProjects = overwrite => {
    setLoading(true);
    setTimeout(() => {
      const fetchedProjects = [
        { id: 1, title: 'Project1', description: 'a description 1' },
        { id: 2, title: 'Project2', description: 'a description 2' },
        { id: 3, title: 'Project3', description: 'a description 3' }
      ];
      console.log('set Projects');
      setProjects(fetchedProjects);
      setLoading(false);
    }, 2000);
  };

  useEffect(() => {
    setLoading(true);
    loadProjects();
  }, []);

  return (
    <div className={classes.mainProjectsContainerBoss}>
      <ProjectFormModal
        project={selectedProject}
        open={openFormModal}
        afterSubmit={reloadPage}
        toggleModal={toggleFormModal}
      />
      <Container variant="stretch">
        <div className={classes.titleContainer}>
          <div className={classes.projectTopTitle}>
            <Typography variant="h4">{t('views.toolbar.projects')}</Typography>
          </div>
        </div>
        <Container variant="fluid" className={classes.searchContainer}>
          <ProjectSearchFilter onChangeProjectFilter={onChangeProjectFilter} />
          <Button
            variant="contained"
            className={classes.addProject}
            onClick={() => {
              setSelectedProject({});
              toggleFormModal();
            }}
          >
            {t('views.projects.addProject')}
          </Button>
        </Container>
        <div className={classes.listContainer}>
          {loading && (
            <div className={classes.spinnerWrapper}>
              <CircularProgress size={50} thickness={2} />
            </div>
          )}
          <Grid container spacing={2}>
            {projects.map(project => {
              return (
                <Grid item key={project.id} xs={12} sm={4} md={3} xl={2}>
                  <div className={classes.mainProjectContainer}>
                    <div className={classes.projectTitleContainer}>
                      <Typography variant="h6" className={classes.projectTitle}>
                        {project.title}
                      </Typography>
                    </div>
                    <div className={classes.descriptionContainer}>
                      <Typography noWrap={false} variant="body2">
                        {project.description.length >= 80
                          ? project.description.slice(0, 80) + '...'
                          : project.description}
                      </Typography>
                    </div>
                    <div className={classes.buttonsContainer}>
                      <Button
                        color="default"
                        aria-label="Edit project"
                        component="span"
                        className={classes.button}
                        classes={{
                          root: classes.button,
                          label: classes.buttonLabel
                        }}
                        onClick={() => {
                          setSelectedProject(project);
                          toggleFormModal();
                        }}
                      >
                        {t('views.projects.editButton').padEnd(5)}
                      </Button>
                      <Button
                        color="default"
                        aria-label="Delete Project"
                        className={classes.button}
                        component="span"
                        onClick={() => {
                          setSelectedProject(project);
                          toggleDeleteModal();
                        }}
                      >
                        {t('views.projects.deleteButton')}
                      </Button>
                    </div>
                  </div>
                </Grid>
              );
            })}
          </Grid>
        </div>
      </Container>
    </div>
  );
};

const styles = theme => ({
  mainProjectsContainerBoss: {
    backgroundColor: theme.palette.background.paper,
    height: '100%',
    minHeight: '90vh'
  },
  titleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative'
  },
  projectTopTitle: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    height: 180
  },
  searchContainer: {
    display: 'flex',
    paddingTop: 20,
    paddingBottom: 40,
    justifyContent: 'space-between'
  },
  listContainer: {
    position: 'relative'
  },
  mainProjectContainer: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingTop: '1rem',
    height: '100%',
    '& $p': {
      fontSize: '14px',
      color: theme.palette.grey.middle,
      marginBottom: 7
    },
    '& $p:last-child': {
      marginBottom: 0
    }
  },
  projectTitle: {
    color: theme.palette.primary.dark,
    lineHeight: 1.2,
    fontSize: '18px',
    marginRight: 'auto',
    marginBottom: 7,
    fontWeight: theme.typography.fontWeightMedium
  },
  projectTitleContainer: {
    height: '20%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingLeft: 16,
    paddingRight: 16
  },
  descriptionContainer: {
    height: 80,
    padding: '0 16px',
    marginTop: 5
  },
  buttonsContainer: {
    position: 'relative',
    display: 'flex',
    height: 50,
    padding: '5px 5px',
    paddingLeft: 10,
    paddingRight: 17
  },
  button: {
    borderRadius: '0%',
    fontSize: 14,
    padding: 0,
    marginRight: 5,
    justifyContent: 'center',
    textDecoration: 'none',
    '&:hover': {
      backgroundColor: theme.palette.background.paper,
      textDecoration: 'none'
    }
  },
  spinnerWrapper: {
    display: 'flex',
    justifyContent: 'center',
    height: 500,
    alignItems: 'center'
  }
});
const mapStateToProps = ({ user }) => ({ user });

export default withRouter(
  withStyles(styles)(
    connect(mapStateToProps)(withTranslation()(withLayout(Projects)))
  )
);
