import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { Assignment, Delete, DeviceHub } from '@material-ui/icons';
import clsx from 'clsx';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { surveysByUserPaginated } from '../api';
import chooseLifeMap from '../assets/choose_life_map.png';
import Container from '../components/Container';
import SearchTextFilter from '../components/filters/SearchTextFilter';
import RadioInput from '../components/RadioInput';
import withLayout from '../components/withLayout';
import { updateSurvey } from '../redux/actions';
import { getDateFormatByLocale } from '../utils/date-utils';
import { ROLES_NAMES } from '../utils/role-utils';
import AssignModal from './surveys/AssignModal';
import SurveyCreateModal from './surveys/SurveyCreateModal';
import SurveyDeleteModal from './surveys/SurveyDeleteModal';

const useStyles = makeStyles(theme => ({
  loadingContainer: {
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed',
    backgroundColor: theme.palette.text.light,
    right: 0,
    bottom: 0,
    top: 0,
    left: 0
  },
  titleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative',
    height: 175
  },
  viewTitle: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    height: 180
  },
  titleImage: {
    display: 'block',
    height: 175,
    right: 0,
    position: 'absolute',
    top: -12,
    zIndex: 0,
    objectFit: 'cover',
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    }
  },
  row: {
    padding: theme.spacing(2),
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    borderBottom: `1px solid ${theme.palette.grey.quarter}`
  },
  icon: {
    fontSize: 32,
    marginRight: theme.spacing(1),
    color: theme.palette.grey.main
  },
  container: {
    display: 'flex',
    alignItems: 'center'
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    minWidth: 300,
    [theme.breakpoints.down('lg')]: {
      maxWidth: 400
    },
    [theme.breakpoints.down('md')]: {
      maxWidth: 300,
      minWidth: 245
    },
    [theme.breakpoints.down('xs')]: {
      minWidth: 230
    }
  },
  tagContainer: {
    [theme.breakpoints.down('xs')]: {
      display: 'flex',
      flexWrap: 'wrap',
      marginLeft: theme.spacing(5),
      width: '55%'
    }
  },
  tag: {
    fontWeight: 550,
    backgroundColor: theme.typography.h4.color,
    color: 'white',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(0.5),
    marginRight: theme.spacing(1),
    width: 'fit-content',
    height: 'fit-content',
    [theme.breakpoints.down('xs')]: {
      marginTop: theme.spacing(1)
    }
  },
  showMoreButtonContainer: {
    width: '100%',
    margin: '2rem 0',
    display: 'flex',
    justifyContent: 'center'
  }
}));

const Surveys = ({ user, updateSurvey }) => {
  const classes = useStyles();
  const {
    t,
    i18n: { language }
  } = useTranslation();
  const dateFormat = getDateFormatByLocale(language);
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(true);
  const [surveys, setSurveys] = useState([]);
  const [filter, setFilter] = useState('');
  const [paginationData, setPaginationData] = useState({
    page: 1,
    totalPages: 1,
    prevPage: 0
  });
  const [selectedSurvey, setSelectedSurvey] = useState({});
  const [openModal, setOpenModal] = useState('');
  const [choosingSurvey, setChoosingSurvey] = useState(false);

  const showMessage = (message, variant) =>
    enqueueSnackbar(message, { variant });

  const getSurveys = overwrite => {
    let page = overwrite ? 1 : paginationData.page;

    if (page !== paginationData.prevPage || overwrite) {
      setLoading(true);
      surveysByUserPaginated(user, filter, page - 1)
        .then(response => {
          let data = response.data.data.surveysByUserPaginated.content;
          let newSurveys = overwrite ? data : [...surveys, ...data];

          setSurveys(newSurveys);
          setPaginationData({
            page: page,
            totalPages: response.data.data.surveysByUserPaginated.totalPages,
            prevPage: page
          });
          setLoading(false);
        })
        .catch(e => {
          showMessage(e.message, 'error');
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    getSurveys(false);
    updateSurvey({});
  }, []);

  useEffect(() => {
    !loading && getSurveys(false);
  }, [paginationData.page]);

  useEffect(() => {
    !loading && getSurveys(true);
  }, [filter]);

  const onChangeFilterText = e => {
    if (e.key === 'Enter') {
      setFilter(e.target.value);
    }
  };

  const showManagementFeatures = ({ role }) =>
    role === ROLES_NAMES.ROLE_ROOT || role === ROLES_NAMES.ROLE_PS_TEAM;

  const showAdminFeatures = ({ role }) => role === ROLES_NAMES.ROLE_ROOT;

  const showOrganizations = ({ role }) => role === ROLES_NAMES.ROLE_HUB_ADMIN;

  const getTagsInfo = (user, { applications, organizations }) => {
    if (showManagementFeatures(user)) return applications || [];
    if (showOrganizations(user)) return organizations || [];
    return [];
  };

  const updateSurveys = (surveyId, applications, organizations) => {
    let index = surveys.findIndex(survey => survey.id === surveyId);
    let newSurveys = Array.from(surveys);
    if (index > -1) {
      newSurveys[index].applications = applications;
      newSurveys[index].organizations = organizations;
    }
    setSurveys(newSurveys);
  };

  const removeSurvey = surveyId => {
    const newSurveys = surveys.filter(survey => survey.id !== surveyId);
    setSurveys(newSurveys);
  };

  return (
    <Container variant="stretch">
      {loading && (
        <div className={classes.loadingContainer}>
          <CircularProgress />
        </div>
      )}
      <SurveyCreateModal
        open={openModal === 'CREATE'}
        selectedSurvey={selectedSurvey}
        setChoosingSurvey={setChoosingSurvey}
        onClose={() => setOpenModal('')}
      />
      <AssignModal
        survey={selectedSurvey}
        open={openModal === 'ASSIGN'}
        toggleModal={() => setOpenModal('')}
        updateSurveys={updateSurveys}
      />
      <SurveyDeleteModal
        surveyToDelete={selectedSurvey}
        user={user}
        open={openModal === 'DELETE'}
        afterSubmit={() => {
          removeSurvey(selectedSurvey.id);
        }}
        toggleModal={() => setOpenModal('')}
      />

      <div className={classes.titleContainer}>
        <div className={classes.viewTitle}>
          <Typography variant="h4">{t('views.toolbar.surveysList')}</Typography>
          <Typography variant="h6" style={{ color: 'grey' }}>
            {t('views.survey.yourSurveys')}
          </Typography>
        </div>
        <img
          src={chooseLifeMap}
          alt="Surveys Banner"
          className={classes.titleImage}
        />
      </div>

      <Grid container spacing={1} style={{ marginTop: 8 }}>
        {showManagementFeatures(user) && (
          <>
            <Grid item md={8} sm={8} xs={12}>
              <SearchTextFilter
                onChangeInput={onChangeFilterText}
                searchLabel={t('views.survey.filter.search')}
                searchByLabel={t('views.survey.filter.searchBy')}
              />
            </Grid>
            {showAdminFeatures(user) && (
              <Grid item md={4} sm={4} xs={12} container justify="flex-end">
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => {
                    setSelectedSurvey({});
                    setOpenModal('CREATE');
                  }}
                >
                  {t('views.survey.create.add')}
                </Button>
              </Grid>
            )}
          </>
        )}
      </Grid>

      {surveys.map(survey => (
        <div key={survey.id} className={classes.row}>
          <div className={classes.container}>
            {choosingSurvey ? (
              <div>
                <RadioInput
                  label={''}
                  value={survey.id}
                  currentValue={selectedSurvey.id}
                  onChange={e => {
                    setSelectedSurvey(survey);
                    setOpenModal('CREATE');
                  }}
                />
              </div>
            ) : (
              <Assignment className={classes.icon} />
            )}

            <div className={classes.info}>
              <Typography variant="subtitle1">{survey.title}</Typography>
              <Typography variant="subtitle2" style={{ color: 'grey' }}>
                {`${moment(survey.createdAt).format(dateFormat)} `}
              </Typography>
              <Typography variant="subtitle2" style={{ color: 'grey' }}>
                {` ${survey.indicatorsCount} ${t('views.survey.indicators')}`}
              </Typography>
            </div>
          </div>
          <div className={clsx(classes.container, classes.tagContainer)}>
            {getTagsInfo(user, survey)
              .slice(0, 3)
              .map(tag => {
                return (
                  <Typography
                    key={tag.id || tag.value}
                    variant="caption"
                    className={classes.tag}
                  >
                    {tag.name || tag.label}
                  </Typography>
                );
              })}
            {getTagsInfo(user, survey).length > 3 && (
              <Typography variant="caption" className={classes.tag}>
                ...
              </Typography>
            )}
          </div>
          <div>
            {(showManagementFeatures(user) || showOrganizations(user)) && (
              <Tooltip title={t('views.survey.assignSurvey.assignSurvey')}>
                <IconButton
                  color="inherit"
                  onClick={() => {
                    setSelectedSurvey(survey);
                    setOpenModal('ASSIGN');
                  }}
                >
                  <DeviceHub />
                </IconButton>
              </Tooltip>
            )}
            {showAdminFeatures(user) && (
              <Tooltip title={t('general.delete')}>
                <IconButton
                  color="inherit"
                  onClick={() => {
                    setSelectedSurvey(survey);
                    setOpenModal('DELETE');
                  }}
                >
                  <Delete />
                </IconButton>
              </Tooltip>
            )}
          </div>
        </div>
      ))}

      {paginationData.page + 1 <= paginationData.totalPages && (
        <div className={classes.showMoreButtonContainer}>
          <Button
            color="primary"
            variant="contained"
            aria-label="Show more"
            component="span"
            onClick={() => {
              setPaginationData({
                page: paginationData.page + 1,
                totalPages: paginationData.totalPages
              });
            }}
          >
            {t('general.showMore')}
          </Button>
        </div>
      )}
    </Container>
  );
};

const mapDispatchToProps = { updateSurvey };

const mapStateToProps = ({ user }) => ({ user });

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withLayout(Surveys));
