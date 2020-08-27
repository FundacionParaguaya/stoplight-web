import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { withStyles, CircularProgress } from '@material-ui/core/';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getSolutions } from '../api';
import solutionBanner from '../assets/user_banner.png';
import BottomSpacer from '../components/BottomSpacer';
import Container from '../components/Container';
import withLayout from '../components/withLayout';
import SolutionsFilters from './solutions/SolutionsFilters';
import { getColorByDimension } from '../utils/styles-utils';

const styles = theme => ({
  titleContainer: {
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative',
    height: 175
  },
  solutionTitle: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    height: 180
  },
  solutionImage: {
    display: 'block',
    height: 175,
    right: 60,
    position: 'absolute',
    top: -10,
    zIndex: 0,
    objectFit: 'cover',
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    }
  },
  bodyContainer: {
    marginTop: 20
  },
  solutionCountContainer: {
    height: 37,
    width: '100%',
    opacity: 1,
    display: 'flex',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20
  },
  cardTitle: {
    color: theme.palette.primary.dark,
    lineHeight: 1.2,
    height: '20%',
    fontSize: '18px',
    marginRight: 'auto',
    marginBottom: 7,
    fontWeight: theme.typography.fontWeightMedium
  },
  descriptionContainer: {
    height: 80,
    marginTop: 16,
    marginBottom: 16
  },
  cardContainer: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '1rem 20px 5px 20px',
    marginRight: 10,
    marginLeft: 10,
    height: '100%',
    alignItems: 'flex-start',
    boxShadow: `1px 3px 7px ${theme.palette.grey.main}`,
    borderRadius: 2,
    '&:hover': {
      borderTop: `3px solid ${theme.palette.primary.main}`
    }
  },
  description: {
    fontSize: '14px',
    color: theme.palette.grey.middle,
    marginBottom: 7
  },
  tagsContainer: {
    marginBottom: 7,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  tag: {
    color: theme.palette.grey.middle,
    padding: 3,
    marginBottom: 8,
    marginRight: 8,
    width: 'fit-content',
    height: 'fit-content'
  },
  button: {
    borderRadius: '0%',
    fontSize: 14,
    padding: 5,
    marginRight: 5,
    justifyContent: 'center',
    alignSelf: 'flex-end',
    textDecoration: 'none',
    '&:hover': {
      backgroundColor: theme.palette.background.paper,
      textDecoration: 'none'
    }
  },
  showMoreButtonContainer: {
    width: '100%',
    marginTop: 30,
    display: 'flex'
  },
  showMoreButton: {
    margin: 'auto'
  },
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
  }
});

const Solutions = ({ classes, user, history }) => {
  const {
    t,
    i18n: { language }
  } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [solutions, setSolutions] = useState([]);
  const [paginationData, setPaginationData] = useState({
    page: 0,
    totalPages: 0,
    totalElements: 0,
    prevPage: 0
  });
  const [filterInput, setFilterInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      lang: language,
      country: '',
      dimension: '',
      indicator: '',
      text: ''
    }
  );

  const loadSolutions = overwrite => {
    setLoading(true);
    let page = overwrite ? 0 : paginationData.page;
    let filterData = {
      page: page,
      user: user.name,
      country: !!filterInput.country ? filterInput.country.value : '',
      dimension: !!filterInput.dimension ? filterInput.dimension.label : '',
      indicators: !!filterInput.indicator
        ? [filterInput.indicator.codeName]
        : [],
      filter: filterInput.text,
      lang: language
    };

    (overwrite || page !== paginationData.prevPage) &&
      getSolutions(user, filterData)
        .then(response => {
          let data = response.data.data.solutions;
          overwrite
            ? setSolutions(data.content)
            : setSolutions([...solutions, data.content]);
          setPaginationData({
            page: page,
            totalPages: data.totalPages,
            totalElements: data.totalElements,
            prevPage: page
          });
        })
        .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadSolutions(true);
  }, [filterInput, language]);

  useEffect(() => {
    !loading && loadSolutions(false);
  }, [paginationData.page]);

  const goToForm = () => history.push(`/solutions/create`);

  const getCountText = totalElements => {
    if (totalElements === 0) return t('views.solutions.noSolutionFound');
    if (totalElements === 1)
      return `${totalElements} ${t('views.solutions.solutionFound')}`;
    return `${totalElements} ${t('views.solutions.solutionsFound')}`;
  };

  const onChangeFilterText = e => {
    if (e.key === 'Enter') {
      setFilterInput({ text: e.target.value });
    }
  };

  return (
    <React.Fragment>
      {loading && (
        <div className={classes.loadingContainer}>
          <CircularProgress />
        </div>
      )}
      <div className={classes.titleContainer}>
        <Container variant="stretch">
          <div className={classes.solutionTitle}>
            <Typography variant="h4">{t('views.toolbar.solutions')}</Typography>
          </div>
          <img
            src={solutionBanner}
            alt="Choose Life Map"
            className={classes.solutionImage}
          />
        </Container>
      </div>

      <div className={classes.bodyContainer}>
        <Container variant="stretch">
          <SolutionsFilters
            countryData={filterInput.country}
            dimensionData={filterInput.dimension}
            indicatorsData={filterInput.indicators}
            onChangeCountry={country => setFilterInput({ country })}
            onChangeDimension={dimension => setFilterInput({ dimension })}
            onChangeIndicator={indicator => setFilterInput({ indicator })}
            onChangeFilterText={onChangeFilterText}
            goToForm={goToForm}
          />
          <div className={classes.solutionCountContainer}>
            <Typography className={classes.labelRows} variant="subtitle1">
              {getCountText(paginationData.totalElements)}
            </Typography>
          </div>
          <Grid container spacing={2}>
            {solutions.map(solution => {
              return (
                <Grid item key={solution.id} xs={12} sm={4} md={4} xl={3}>
                  <div className={classes.cardContainer}>
                    <Typography variant="h6" className={classes.cardTitle}>
                      {solution.title}
                    </Typography>
                    <div className={classes.descriptionContainer}>
                      <Typography
                        noWrap={false}
                        variant="body2"
                        className={classes.description}
                      >
                        {solution.description}
                      </Typography>
                    </div>
                    <div className={classes.tagsContainer}>
                      {solution.indicatorsNames
                        .slice(0, 3)
                        .map((indicator, index) => {
                          return (
                            <Typography
                              key={index}
                              variant="caption"
                              className={classes.tag}
                              style={{
                                backgroundColor: getColorByDimension(
                                  solution.dimension || ''
                                )
                              }}
                            >
                              {indicator}
                            </Typography>
                          );
                        })}
                      {solution.indicatorsNames.length > 3 && (
                        <Typography variant="caption" className={classes.tag}>
                          ...
                        </Typography>
                      )}
                    </div>
                    <Button
                      color="default"
                      aria-label="Delete Hub"
                      className={classes.button}
                      component="span"
                      onClick={() => {
                        console.log(solution);
                      }}
                    >
                      {t('views.solutions.viewmore')}
                    </Button>
                  </div>
                </Grid>
              );
            })}
          </Grid>
          {paginationData.page + 1 < paginationData.totalPages && (
            <div className={classes.showMoreButtonContainer}>
              <Button
                variant="contained"
                aria-label="Show more"
                className={classes.showMoreButton}
                component="span"
                onClick={() => {
                  setPaginationData({
                    ...paginationData,
                    page: paginationData.page + 1
                  });
                }}
              >
                {t('general.showMore')}
              </Button>
            </div>
          )}
        </Container>
      </div>
      <BottomSpacer />
    </React.Fragment>
  );
};

const mapStateToProps = ({ user }) => ({ user });

export default withRouter(
  withStyles(styles)(connect(mapStateToProps)(withLayout(Solutions)))
);
