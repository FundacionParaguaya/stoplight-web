import * as _ from 'lodash';

import {
  CircularProgress,
  IconButton,
  Typography,
  withStyles
} from '@material-ui/core/';
import React, { useEffect, useState } from 'react';
import { getArticles, getCollectionTypes } from '../api';

import ArticlesList from './support/ArticlesList';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import Container from '../components/Container';
import { Grid } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';
import { ROLES_NAMES } from '../utils/role-utils';
import SearchIcon from '@material-ui/icons/Search';
import SupportLangPicker from './support/SupportLangPicker';
import { connect } from 'react-redux';
import { getLanguageByCode } from '../utils/lang-utils';
import i18n from '../i18n';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import withLayout from '../components/withLayout';
import { withRouter } from 'react-router-dom';
import { withSnackbar } from 'notistack';

const styles = theme => ({
  titleContainer: {
    backgroundColor: theme.palette.primary.main,
    paddingTop: 35,
    paddingBottom: 35
  },
  paperRoot: {
    flex: 1,
    display: 'flex',
    padding: '8px 1px 8px 2px'
  },
  content: {
    maxWidth: '100%',
    width: 900,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  headerMetaWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  headerMetaText: {
    color: theme.palette.background.default,
    fontWeight: 600,
    cursor: 'pointer'
  },
  titleStyle: {
    fontSize: 28,
    color: theme.palette.background.default,
    marginBottom: 27,
    lineHeight: '1.24'
  },
  search: {
    display: 'flex',
    alignItems: 'center',
    flex: 1
  },
  iconButton: {
    padding: 15
  },
  searchInput: {
    padding: '0 !important'
  },
  mainContainer: {
    backgroundColor: theme.palette.background.paper,
    height: '100%'
  },
  sectionCard: {
    padding: 30,
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    marginTop: 16,
    cursor: 'pointer'
  },
  container: {
    paddingLeft: 20,
    paddingRight: 20
  },
  sectionContainer: {
    maxWidth: '100%',
    width: '900px',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingBottom: 20
  },
  icon: {
    marginLeft: 10,
    fontSize: '3em'
  },
  sectionCardBody: {
    paddingLeft: 30
  },
  cardTitle: {
    fontSize: '18px'
  },
  cardSubtitle: {
    margin: '5px 0px 11px'
  },
  cardBodyText: {
    fontSize: 13
  },
  cardBodySubText: {
    color: theme.palette.text.light
  },
  iconContainer: {
    padding: 20
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
  },
  button: {
    height: 39,
    marginBottom: 20
  },
  secondaryButton: {
    width: 300,
    height: 34,
    marginBottom: 20
  },
  buttonContainer: {
    display: 'flex',
    paddingTop: 20,
    justifyContent: 'flex-end'
  },
  secondaryButtonContainer: {
    display: 'flex',
    paddingTop: 20,
    justifyContent: 'center'
  },
  emptyCollection: {
    fontSize: 16,
    marginTop: 10
  }
});

const useQuery = () => new URLSearchParams(useLocation().search);

const Support = ({
  classes,
  user,
  history,
  enqueueSnackbar,
  closeSnackbar
}) => {
  const {
    t,
    i18n: { language }
  } = useTranslation();

  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState(getLanguageByCode(language));

  const [articles, setArticles] = useState([]);
  const query = useQuery();
  const searchQuery = query.get('q');

  const collectionTypeOptions = [
    {
      label: t('views.support.collections.generalDescription'),
      value: 'GENERAL',
      icon: 'help_outline'
    },
    {
      label: t('views.support.collections.appDescription'),
      value: 'APP',
      icon: 'smartphone'
    },
    {
      label: t('views.support.collections.webDescription'),
      value: 'WEB',
      icon: 'computer'
    },
    {
      label: t('views.support.collections.surveyBuilderDescription'),
      value: 'SURVEY_BUILDER',
      icon: 'build_circle'
    }
  ];

  const handleGoSupport = () => {
    history.push('/support');
  };

  const handleGoCollection = collection => {
    const transformedSlug = collection.toLowerCase();
    history.push(`/collection/${transformedSlug}`);
  };

  const goToForm = () => history.push(`/articles/create`);

  const goToSupport = () => history.push(`/support`);

  const onChangeSearchFilter = e => {
    if (e.key === 'Enter') {
      if (!!e.target.value) {
        history.push({
          pathname: `/support`,
          search: `q=${e.target.value}`
        });
      } else {
        history.push('/support');
      }
    }
  };

  const handleGoArticle = articleId => {
    history.push(`/article/${articleId}`);
  };

  const showCreateArticle = ({ role }) =>
    role === ROLES_NAMES.ROLE_PS_TEAM || role === ROLES_NAMES.ROLE_ROOT;

  const showAllArticles = ({ role }) =>
    role === ROLES_NAMES.ROLE_PS_TEAM || role === ROLES_NAMES.ROLE_ROOT;

  const showSurveyBuilderCollection = () =>
    user.role === ROLES_NAMES.ROLE_PS_TEAM ||
    user.role === ROLES_NAMES.ROLE_ROOT;

  useEffect(() => {
    if (searchQuery !== '' && searchQuery !== 0 && searchQuery !== null) {
      setLoading(true);
      getArticles(user, searchQuery, '', lang, [])
        .then(res => {
          const data = _.get(res, 'data.data.listArticles', []);
          let visibleArticles = showAllArticles(user)
            ? data
            : data.filter(el => el.published);
          if (!showSurveyBuilderCollection)
            visibleArticles.filter(
              article => article.collection !== 'SURVEY_BUILDER'
            );
          setArticles(visibleArticles);
          setCollections([]);
        })
        .catch(e => {
          console.log(e);
          enqueueSnackbar(t('views.support.failRequest'), {
            variant: 'error',
            action: key => (
              <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
                <CloseIcon style={{ color: 'white' }} />
              </IconButton>
            )
          });
        })
        .finally(() => setLoading(false));
    } else {
      let updatedCollections = [];
      setLoading(true);
      getCollectionTypes(user, lang)
        .then(response => {
          const collectionTypes = _.get(
            response,
            'data.data.listArticlesTypes',
            []
          );

          getArticles(user, null, '', lang, [])
            .then(res => {
              const data = _.get(res, 'data.data.listArticles', []);

              const visibleArticles = showAllArticles(user)
                ? data
                : data.filter(el => el.published);

              updatedCollections = collectionTypes.map(collection => {
                const countArticles = visibleArticles.filter(
                  article =>
                    article.collection === collection.code && article.published
                ).length;
                const { icon, label } = collectionTypeOptions.find(
                  type => type.value === collection.code
                );
                return {
                  ...collection,
                  countArticles,
                  icon,
                  subtitle: label
                };
              });
              if (!showSurveyBuilderCollection())
                updatedCollections = updatedCollections.filter(
                  collection => collection.code !== 'SURVEY_BUILDER'
                );
              setCollections(updatedCollections);
              setArticles([]);
            })
            .catch(e => {
              console.log(e);
              enqueueSnackbar(t('views.support.failRequest'), {
                variant: 'error',
                action: key => (
                  <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
                    <CloseIcon style={{ color: 'white' }} />
                  </IconButton>
                )
              });
            })
            .finally(() => setLoading(false));
        })
        .catch(e => {
          console.log(e);
          enqueueSnackbar(t('views.support.failRequest'), {
            variant: 'error',
            action: key => (
              <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
                <CloseIcon style={{ color: 'white' }} />
              </IconButton>
            )
          });
        })
        .finally(() => setLoading(false));
    }
  }, [searchQuery, lang]);
  return (
    <div className={classes.mainContainer}>
      {loading && (
        <div className={classes.loadingContainer}>
          <CircularProgress />
        </div>
      )}
      <div className={classes.titleContainer}>
        <Container variant="stretch">
          <div className={classes.content}>
            <div className={classes.headerMetaWrapper}>
              <Typography
                onClick={handleGoSupport}
                variant="h6"
                className={classes.headerMetaText}
              >
                {t('views.support.metaTitle')}
              </Typography>
              <SupportLangPicker
                language={lang}
                setLanguage={lng => {
                  i18n.changeLanguage(lng);
                  localStorage.setItem('language', lng);
                  setLang(getLanguageByCode(lng));
                }}
              />
            </div>
            <Typography variant="subtitle2" className={classes.titleStyle}>
              {t('views.support.headerTitle')}
            </Typography>
            <div className={classes.search}>
              <Paper className={classes.paperRoot}>
                <IconButton className={classes.iconButton}>
                  <SearchIcon />
                </IconButton>
                <InputBase
                  placeholder={t('views.support.search')}
                  classes={{
                    input: classes.searchInput
                  }}
                  onKeyDown={onChangeSearchFilter}
                />
              </Paper>
            </div>
          </div>
        </Container>
      </div>
      <div className={classes.bodyContainer}>
        <div className={classes.container}>
          <div className={classes.sectionContainer}>
            {showCreateArticle(user) && (
              <div className={classes.buttonContainer}>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={goToForm}
                  className={classes.button}
                >
                  {t('views.support.addArticle')}
                </Button>
              </div>
            )}

            {collections.map((collection, index) => {
              return (
                <Paper
                  key={index}
                  variant="outlined"
                  elevation={3}
                  className={classes.sectionCard}
                  onClick={() => handleGoCollection(collection.code)}
                >
                  <Grid alignItems="center" container spacing={5}>
                    <Grid item className={classes.iconContainer}>
                      <Icon className={classes.icon}>{collection.icon}</Icon>
                    </Grid>
                    <Grid item className={classes.sectionCardBody}>
                      <Typography
                        variant="h5"
                        color="primary"
                        className={classes.cardTitle}
                      >
                        {collection.description}
                      </Typography>
                      <Typography variant="h6" className={classes.cardSubtitle}>
                        {collection.subtitle}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        className={classes.cardBodyText}
                      >
                        {`${collection.countArticles} ${t(
                          'views.support.countArticles'
                        )}`}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        className={classes.cardBodyText}
                      >
                        <span className={classes.cardBodySubText}>
                          {t('views.support.writeBy')}
                        </span>{' '}
                        {t('views.support.team')}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              );
            })}
            <ArticlesList
              articles={articles}
              handleGoArticle={handleGoArticle}
            />
            {searchQuery !== '' &&
              searchQuery !== 0 &&
              searchQuery !== null &&
              articles.length === 0 && (
                <>
                  <Typography
                    variant="h6"
                    align="center"
                    className={classes.emptyCollection}
                  >
                    {t('views.support.noArticles')}
                  </Typography>
                  <div className={classes.secondaryButtonContainer}>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={goToSupport}
                      className={classes.secondaryButton}
                    >
                      {t('views.support.allCollections')}
                    </Button>
                  </div>
                </>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ user }) => ({ user });

export default withRouter(
  withStyles(styles)(
    connect(mapStateToProps)(withSnackbar(withLayout(Support)))
  )
);
