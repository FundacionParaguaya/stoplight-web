import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { withRouter, useParams } from 'react-router';
import {
  CircularProgress,
  Typography,
  IconButton,
  InputBase,
  Icon,
  Grid
} from '@material-ui/core';
import withLayout from '../../components/withLayout';
import Container from '../../components/Container';
import { useTranslation } from 'react-i18next';
import SearchIcon from '@material-ui/icons/Search';
import Paper from '@material-ui/core/Paper';
import { getArticles, getCollectionTypes } from '../../api';
import * as _ from 'lodash';
import NavigationBar from '../../components/NavigationBar';
import ArticleList from './ArticlesList';
import { getLanguageByCode } from '../../utils/lang-utils';
import i18n from '../../i18n';
import SupportLangPicker from './SupportLangPicker';
import { withSnackbar } from 'notistack';
import CloseIcon from '@material-ui/icons/Close';
import { ROLES_NAMES } from '../../utils/role-utils';

const styles = theme => ({
  mainContainer: {
    backgroundColor: theme.palette.background.paper,
    height: '100%'
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
  titleContainer: {
    backgroundColor: theme.palette.primary.main,
    paddingTop: 35,
    paddingBottom: 35
  },
  headerMetaWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  headerMetaText: {
    color: theme.palette.background.default,
    fontWeight: 600
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
  iconContainer: {
    padding: 30
  },
  icon: {
    fontSize: '3em'
  },
  sectionContainer: {
    paddingBottom: 20,
    maxWidth: '100%',
    width: '900px',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  sectionHeader: {
    padding: 30
  },
  sectionTitle: {
    fontSize: '18px'
  },
  sectionSubtitle: {
    margin: '5px 0px 11px'
  },
  sectionText: {
    fontSize: 13
  },
  sectionCard: {
    marginTop: 16,
    padding: 30,
    backgroundColor: theme.palette.background.default
  },
  cardTitle: {
    fontSize: 18
  },
  cardSubtitle: {
    margin: '5px 0px 11px'
  },
  emptyCollection: {
    fontSize: 16,
    marginTop: 10
  },
  container: {
    paddingLeft: 20,
    paddingRight: 20
  },
  cardBodySubText: {
    color: theme.palette.text.light
  }
});

const CollectionView = ({
  classes,
  user,
  history,
  enqueueSnackbar,
  closeSnackbar
}) => {
  const { slug } = useParams();
  const [loading, setLoading] = useState(false);
  const [collection, setCollection] = useState({});
  const [articles, setArticles] = useState([]);
  const {
    t,
    i18n: { language }
  } = useTranslation();
  const [lang, setLang] = useState(getLanguageByCode(language));

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
    }
  ];
  const slugUpperCase = !!slug && slug.toUpperCase();

  const handleGoArticle = articleId => {
    history.push(`/article/${articleId}`);
  };

  const onChangeSearchFilter = e => {
    if (e.key === 'Enter') {
      history.push({
        pathname: `/support`,
        search: `q=${e.target.value}`
      });
    }
  };

  const showAllArticles = ({ role }) =>
    role === ROLES_NAMES.ROLE_PS_TEAM || role === ROLES_NAMES.ROLE_ROOT;

  useEffect(() => {
    setLoading(true);
    getCollectionTypes(user, language)
      .then(response => {
        const collectionTypes = _.get(
          response,
          'data.data.listArticlesTypes',
          []
        );

        getArticles(user, null, slugUpperCase, lang, [])
          .then(res => {
            const data = _.get(res, 'data.data.listArticles', []);

            const visibleArticles = showAllArticles(user)
              ? data
              : data.filter(el => el.published);

            const selectedCollection = collectionTypes.find(
              el => el.code === slugUpperCase
            );
            const { icon, label } = collectionTypeOptions.find(
              type => type.value === slugUpperCase
            );
            const updatedCollection = {
              ...selectedCollection,
              icon,
              subtitle: label,
              countArticles: data.length
            };
            setCollection(updatedCollection);
            setArticles(visibleArticles);
          })
          .catch(e => {
            console.log(e);
            enqueueSnackbar(t('views.support.failedRequest'), {
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
        enqueueSnackbar(t('views.support.failedRequest'), {
          variant: 'error',
          action: key => (
            <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
              <CloseIcon style={{ color: 'white' }} />
            </IconButton>
          )
        });
      })
      .finally(() => setLoading(false));
  }, [lang]);

  const navigationOptions = [
    { label: t('views.support.allCollections'), link: '/support' },
    { label: slug, link: `/collection/${slug}` }
  ];

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
              <Typography variant="h6" className={classes.headerMetaText}>
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
                  onKeyDown={e => onChangeSearchFilter(e)}
                />
              </Paper>
            </div>
          </div>
        </Container>
      </div>
      <div className={classes.bodyContainer}>
        <div className={classes.container}>
          <div className={classes.sectionContainer}>
            <div className={classes.sectionHeader}>
              <Grid alignItems="center" container spacing={0}>
                <Grid item className={classes.iconContainer}>
                  <Icon className={classes.icon}>{collection.icon}</Icon>
                </Grid>
                <Grid item>
                  <Typography
                    variant="h5"
                    color="primary"
                    className={classes.sectionTitle}
                  >
                    {collection.description}
                  </Typography>
                  <Typography variant="h6" className={classes.sectionSubtitle}>
                    {collection.subtitle}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    className={classes.sectionText}
                  >
                    {!!collection &&
                      `${collection.countArticles} ${t(
                        'views.support.countArticles'
                      )}`}
                  </Typography>
                </Grid>
              </Grid>
            </div>
            <NavigationBar options={navigationOptions} />
            <ArticleList
              articles={articles}
              handleGoArticle={handleGoArticle}
            />
            {articles.length === 0 && (
              <Typography variant="h6" className={classes.emptyCollection}>
                {t('views.support.noArticles')}
              </Typography>
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
    connect(mapStateToProps)(withSnackbar(withLayout(CollectionView)))
  )
);
