import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import GetAppIcon from '@material-ui/icons/GetApp';
import GroupIcon from '@material-ui/icons/Group';
import LabelIcon from '@material-ui/icons/Label';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import clsx from 'clsx';
import countries from 'localized-countries';
import { withSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getSolutionById, updateSolutionView } from '../../api';
import NavigationBar from '../../components/NavigationBar';
import withLayout from '../../components/withLayout';
import { getPreviewForFile } from '../../utils/files-utils';
import { ROLES_NAMES } from '../../utils/role-utils';
import {
  getDimensionColor,
  getIndicatorColorByDimension
} from '../../utils/styles-utils';
import DeleteSolutionModal from './DeleteSolutionModal';

const useStyles = makeStyles(theme => ({
  loadingContainer: {
    zIndex: 1000,
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
  form: {
    height: '100%',
    marginBottom: '2rem'
  },
  innerFrom: {
    paddingLeft: '20vw',
    paddingRight: '20vw'
  },
  headInputs: {
    backgroundColor: theme.palette.background.paper,
    marginBottom: 20
  },
  label: {
    marginTop: 10,
    marginBottom: 10,
    width: '100%'
  },
  tag: {
    color: theme.palette.grey.middle,
    fontFamily: 'Poppins',
    borderRadius: 6,
    padding: '6px 10px 6px 10px',
    marginBottom: 10,
    marginRight: 4,
    width: 'fit-content',
    height: 'fit-content',
    overflowWrap: 'break-word'
  },
  icon: {
    color: theme.palette.primary.main,
    marginRight: 5
  },
  button: {
    margin: 5,
    height: 40,
    width: 85
  },
  actionIcon: {
    padding: 0,
    paddingBottom: 6,
    color: theme.palette.grey.middle,
    width: 30
  },
  preview: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '3px 6px 3px 6px'
  },
  thumbsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    marginBottom: 16
  },
  thumb: {
    position: 'relative',
    display: 'inline-flex',
    borderRadius: 2,
    border: `1px solid ${theme.palette.primary.main}`,
    marginBottom: 8,
    marginRight: 8,
    width: 125,
    height: 125,
    padding: 4,
    boxSizing: 'border-box'
  },
  thumbInner: {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
  },
  thumbName: {
    maxWidth: 100,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  },
  img: {
    display: 'block',
    width: '100%',
    height: '100%'
  },
  closeButton: {
    position: 'absolute',
    bottom: -5,
    right: 2,
    minWidth: 36,
    padding: 0,
    borderRadius: '50%'
  },
  solutionType: {
    alignItems: 'center',
    backgroundColor: theme.palette.grey.quarter,
    display: 'flex'
  },
  solutionTypeIcon: {
    marginRight: 3,
    width: 19
  },
  defaultContentRich: {
    fontFamily: 'Open sans'
  }
}));

const SolutionsView = ({ user, history, enqueueSnackbar, closeSnackbar }) => {
  const classes = useStyles();
  const {
    t,
    i18n: { language }
  } = useTranslation();
  let { id } = useParams();
  const navigationOptions = [
    { label: t('views.toolbar.solutions'), link: '/solutions' },
    { label: t('views.solutions.solution'), link: `/solution/${id}` }
  ];

  const [loading, setLoading] = useState(true);
  const [deleteData, setDeleteData] = useState({
    openModal: false,
    solutionId: ''
  });
  const [solution, setSolution] = useState({
    indicatorsNames: [],
    resources: []
  });
  const [country, setCountry] = useState('');

  const updateSolution = solutionId => {
    updateSolutionView(user, solutionId).catch(() => {
      enqueueSnackbar(t('views.solutions.failUpdateView'), {
        variant: 'error',
        action: key => (
          <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
            <CloseIcon style={{ color: 'white' }} />
          </IconButton>
        )
      });
    });
  };

  useEffect(() => {
    setLoading(true);
    updateSolution(id);
    let countryOptions = countries(
      require(`localized-countries/data/${language}`)
    ).array();
    getSolutionById(user, id)
      .then(response => {
        let data = response.data.data.getSolutionById;

        setSolution(data);
        setCountry(
          countryOptions.find(country => country.code === data.country).label
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const showButtons = ({ role }) => {
    return (
      (!!user.organization &&
        !!user.organization.id &&
        user.organization.id === solution.organization) ||
      (!!user.hub &&
        !!user.hub.id &&
        user.hub.id === solution.hub &&
        role === ROLES_NAMES.ROLE_HUB_ADMIN) ||
      role === ROLES_NAMES.ROLE_ROOT ||
      role === ROLES_NAMES.ROLE_PS_TEAM
    );
  };

  return (
    <React.Fragment>
      {loading && (
        <div className={classes.loadingContainer}>
          <CircularProgress />
        </div>
      )}
      <div className={classes.form}>
        <DeleteSolutionModal
          open={deleteData.openModal}
          solutionId={deleteData.solutionId}
          onClose={() => setDeleteData({ ...deleteData, openModal: false })}
          afterSubmit={() => history.push('/solutions')}
        />
        <div className={classes.headInputs}>
          <div className={classes.innerFrom}>
            <NavigationBar options={navigationOptions}></NavigationBar>
            <Grid container spacing={1} style={{ paddingTop: '2rem' }}>
              <Grid item md={8} container>
                <Typography variant="h4" className={classes.label}>
                  {solution.title}
                </Typography>

                <Typography variant="h6" className={classes.label}>
                  {solution.description}
                </Typography>
              </Grid>
              {showButtons(user) && (
                <Grid
                  item
                  md={4}
                  container
                  justify="flex-end"
                  alignContent="flex-end"
                >
                  <Tooltip title={t('views.solutions.form.deleteButton')}>
                    <Button
                      className={classes.actionIcon}
                      onClick={() => {
                        setDeleteData({
                          openModal: true,
                          solutionId: solution.id
                        });
                      }}
                    >
                      <DeleteIcon />
                    </Button>
                  </Tooltip>
                  <Tooltip title={t('views.solutions.form.editButton')}>
                    <Button
                      className={classes.actionIcon}
                      onClick={() => {
                        history.push(`edit/${solution.id}`);
                      }}
                    >
                      <EditIcon />
                    </Button>
                  </Tooltip>
                </Grid>
              )}
            </Grid>
          </div>
        </div>
        <div className={classes.innerFrom}>
          <Grid container>
            <Grid item md={8} container justify="space-between">
              {solution.showAuthor && (
                <Grid item lg={5} md={6} xs={8} container>
                  <GroupIcon className={classes.icon} />
                  <Typography variant="h6">
                    {solution.organizationName ||
                      solution.hubName ||
                      'Fundacion Paraguaya'}
                  </Typography>
                </Grid>
              )}
              <Grid item lg={3} md={4} container justify="flex-end">
                <LocationOnIcon className={classes.icon} />
                <Typography variant="h6">{country}</Typography>
              </Grid>
            </Grid>
            <Grid item md={4}>
              <Grid item md={12} container justify="flex-end">
                {solution.type && (
                  <Typography
                    variant="caption"
                    className={clsx(classes.tag, classes.solutionType)}
                  >
                    <LabelIcon className={classes.solutionTypeIcon} />
                    {solution.type}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item md={8} style={{ overflowWrap: 'break-word' }}>
              {
                <div
                  className={classes.defaultContentRich}
                  dangerouslySetInnerHTML={{ __html: solution.contentRich }}
                />
              }
            </Grid>
            <Grid item md={4}>
              <Grid item md={12} container justify="flex-end">
                <Typography
                  variant="caption"
                  className={classes.tag}
                  style={{
                    backgroundColor: getDimensionColor(solution.dimension || '')
                  }}
                >
                  {solution.dimension}
                </Typography>
              </Grid>
              <Grid item md={12} container justify="flex-end">
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  {solution.indicatorsNames.map((indicator, index) => {
                    return (
                      <Typography
                        key={index}
                        variant="caption"
                        className={classes.tag}
                        style={{
                          backgroundColor: getIndicatorColorByDimension(
                            solution.dimension || ''
                          )
                        }}
                      >
                        {indicator}
                      </Typography>
                    );
                  })}
                </div>
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={8}>
            {!!solution.resources && solution.resources.length > 0 && (
              <>
                <Typography variant="h5" className={classes.label}>
                  {`${t('views.solutions.form.resource')}:`}
                </Typography>
                <aside className={classes.thumbsContainer}>
                  {solution.resources.map((resource, index) => (
                    <div className={classes.preview} key={index}>
                      <div className={classes.thumb}>
                        <div className={classes.thumbInner}>
                          <Button
                            href={resource.url}
                            className={classes.closeButton}
                            download
                            color="primary"
                          >
                            <GetAppIcon />
                          </Button>
                          <img
                            alt="index"
                            className={classes.img}
                            src={getPreviewForFile(resource)}
                          />
                        </div>
                      </div>
                      <Tooltip title={resource.title}>
                        <Typography
                          variant="subtitle2"
                          align="center"
                          className={classes.thumbName}
                        >
                          {resource.title}
                        </Typography>
                      </Tooltip>
                    </div>
                  ))}
                </aside>
              </>
            )}
            {!!solution.contactInfo && (
              <>
                <Typography variant="h5" className={classes.label}>
                  {`${t('views.solutions.form.contact')}:`}
                </Typography>
                <Typography variant="h6">{solution.contactInfo}</Typography>
              </>
            )}
          </Grid>
        </div>
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = ({ user }) => ({
  user
});

export default connect(mapStateToProps)(
  withLayout(withSnackbar(SolutionsView))
);
