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
import ProjectFormModal from './projects/ProjectFormModal';
import DeleteProjectModal from './projects/DeleteProjectModal';
import { getProjectsPaginated } from '../api';
import BottomSpacer from '../components/BottomSpacer';
import { ROLES_NAMES } from '../utils/role-utils';
import NavigationBar from '../components/NavigationBar';

const Projects = ({ history, classes, t, user, i18n: { language } }) => {
  const orgId = history.location.state ? [history.location.state.orgId] : null;
  const readOnly = user.role !== ROLES_NAMES.ROLE_APP_ADMIN ? true : false;
  const [filter, setFilter] = useState('');
  const [openFormModal, setOpenFormModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState({});
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [paginationData, setPaginationData] = useState({
    page: 1,
    totalPages: 1,
    totalElements: 0,
    prevPage: 0
  });

  const onChangeProjectFilter = e => {
    if (e.key === 'Enter') {
      setFilter(e.target.value);
    }
  };

  const toggleFormModal = () => {
    setOpenFormModal(!openFormModal);
  };

  const toggleDeleteModal = () => {
    setOpenDeleteModal(!openDeleteModal);
  };

  const reloadPage = () => {
    loadProjects(true);
  };

  const nextPage = () => {
    if (paginationData.page + 1 <= paginationData.totalPages) {
      setPaginationData({
        page: paginationData.page + 1,
        totalPages: paginationData.totalPages
      });
    }
  };

  const loadProjects = overwrite => {
    const page = overwrite ? 1 : paginationData.page;
    let filterData = {
      page: page - 1,
      filter: filter,
      organizations: orgId,
      sortBy: '',
      sortDirection: ''
    };
    if (page !== paginationData.prevPage || overwrite) {
      setLoading(true);
      getProjectsPaginated(user, filterData)
        .then(response => {
          let data = response.data.data.searchProjects;

          let projectsList = overwrite
            ? data.content
            : [...projects, ...data.content];

          setProjects(projectsList);
          setPaginationData({
            page: page,
            totalPages: data.totalPages,
            totalElements: data.totalElements,
            prevPage: page
          });
        })
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    setLoading(true);
    loadProjects();
  }, []);

  useEffect(() => {
    !openDeleteModal && !openFormModal && !loading && loadProjects(false);
  }, [paginationData.page]);

  useEffect(() => {
    !openDeleteModal && !openFormModal && !loading && loadProjects(true);
  }, [filter]);

  const navigationOptions = [
    { label: t('views.toolbar.organizations'), link: '/organizations' },
    { label: t('views.toolbar.projects'), link: '/projects' }
  ];

  return (
    <div className={classes.mainProjectsContainerBoss}>
      <Container variant="stretch">
        {readOnly && <NavigationBar options={navigationOptions} />}
      </Container>
      <ProjectFormModal
        project={selectedProject}
        open={openFormModal}
        afterSubmit={reloadPage}
        toggleModal={toggleFormModal}
      />
      <DeleteProjectModal
        project={selectedProject}
        open={openDeleteModal}
        afterSubmit={reloadPage}
        toggleModal={toggleDeleteModal}
      />
      <Container variant="stretch">
        <div className={classes.titleContainer}>
          <div className={classes.projectTopTitle}>
            <Typography variant="h4">{t('views.toolbar.projects')}</Typography>
          </div>
        </div>
        <Container variant="fluid" className={classes.searchContainer}>
          <ProjectSearchFilter onChangeProjectFilter={onChangeProjectFilter} />
          {!readOnly && (
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
          )}
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
                        {project.description.length > 80
                          ? project.description.slice(0, 80) + '...'
                          : project.description}
                      </Typography>
                    </div>
                    {!!project.color && (
                      <div className={classes.tagContainer}>
                        <div
                          className={classes.tag}
                          style={{
                            backgroundColor: project.color
                              ? project.color
                              : null
                          }}
                        />
                      </div>
                    )}

                    {!readOnly && (
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
                    )}
                  </div>
                </Grid>
              );
            })}
          </Grid>
          {paginationData.page < paginationData.totalPages && (
            <div className={classes.showMoreButtonContainer}>
              <Button
                variant="contained"
                aria-label="Show more"
                className={classes.showMoreButton}
                component="span"
                onClick={() => {
                  nextPage();
                }}
              >
                {t('general.showMore')}
              </Button>
            </div>
          )}
        </div>
      </Container>
      <BottomSpacer />
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
  },
  showMoreButtonContainer: {
    width: '100%',
    marginTop: 30,
    display: 'flex'
  },
  showMoreButton: {
    margin: 'auto'
  },
  tagContainer: {
    width: '100%',
    padding: '16px'
  },
  tag: {
    backgroundColor: 'red',
    width: '40px',
    height: '18px',
    borderRadius: '16px'
  }
});
const mapStateToProps = ({ user }) => ({ user });

export default withRouter(
  withStyles(styles)(
    connect(mapStateToProps)(withTranslation()(withLayout(Projects)))
  )
);
