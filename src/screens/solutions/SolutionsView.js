import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import GetAppIcon from '@material-ui/icons/GetApp';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import countries from 'localized-countries';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getSolutionById } from '../../api';
import organizationIcon from '../../assets/dimension_organization.png';
import withLayout from '../../components/withLayout';
import {
  getDimensionColor,
  getIndicatorColorByDimension
} from '../../utils/styles-utils';

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
    width: '100vw',
    height: '100%'
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
    padding: 3,
    marginBottom: 10,
    marginRight: 4,
    width: 'fit-content',
    height: 'fit-content'
  },
  icon: {
    color: theme.palette.primary.main,
    marginRight: 5
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
  }
}));

const SolutionsView = ({ user, history }) => {
  const classes = useStyles();
  const {
    t,
    i18n: { language }
  } = useTranslation();
  let { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [solution, setSolution] = useState({
    indicatorsNames: [],
    resources: []
  });
  const [country, setCountry] = useState('');

  useEffect(() => {
    setLoading(true);
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

  const getUrl = resource => {
    return resource.url;
  };

  return (
    <React.Fragment>
      {loading && (
        <div className={classes.loadingContainer}>
          <CircularProgress />
        </div>
      )}
      <div className={classes.form}>
        <div className={classes.headInputs}>
          <div className={classes.innerFrom} style={{ paddingTop: '3rem' }}>
            <Grid container spacing={1}>
              <Grid item md={8} container>
                <Typography variant="h4" className={classes.label}>
                  {solution.title}
                </Typography>

                <Typography variant="h6" className={classes.label}>
                  {solution.description}
                </Typography>
              </Grid>
              <Grid
                item
                md={4}
                container
                justify="flex-end"
                alignContent="flex-end"
              >
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
              </Grid>
            </Grid>
          </div>
        </div>
        <div className={classes.innerFrom}>
          <Grid container>
            <Grid item md={3} container>
              <LocationOnIcon className={classes.icon} />
              <Typography variant="h6">{country}</Typography>
            </Grid>
            <Grid item md={5} container>
              {solution.showAuthor && (
                <>
                  <img
                    src={organizationIcon}
                    height="30px"
                    width="30px"
                    alt=""
                    style={{ marginRight: 5 }}
                  />
                  <Typography variant="h6">
                    {solution.organization ||
                      solution.hub ||
                      'Fundacion Paraguaya'}
                  </Typography>
                </>
              )}
            </Grid>
            <Grid item md={4} container justify="flex-end">
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
          </Grid>
          <Grid item md={8} style={{ overflowWrap: 'break-word' }}>
            <Typography variant="h5" className={classes.label}>
              {`${t('views.solutions.form.contentLabel')}:`}
            </Typography>
            {<div dangerouslySetInnerHTML={{ __html: solution.contentRich }} />}
          </Grid>
          <Grid item md={8}>
            {!!solution.resources && solution.resources.length > 0 && (
              <>
                <Typography variant="h5" className={classes.label}>
                  {`${t('views.solutions.form.resource')}:`}
                </Typography>
                <aside className={classes.thumbsContainer}>
                  {solution.resources.map((resource, index) => (
                    <div className={classes.thumb} key={index}>
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
                          src={getUrl(resource)}
                        />
                      </div>
                    </div>
                  ))}
                </aside>
              </>
            )}
            <Typography variant="h5" className={classes.label}>
              {`${t('views.solutions.form.contact')}:`}
            </Typography>
            <Typography variant="h6">{solution.contactInfo}</Typography>
          </Grid>
        </div>
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = ({ user }) => ({
  user
});

export default connect(mapStateToProps)(withLayout(SolutionsView));
