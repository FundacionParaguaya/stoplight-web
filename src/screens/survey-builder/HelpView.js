import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import * as _ from 'lodash';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getArticles } from '../../api';
import ArticlesList from '../support/ArticlesList';
import SearchText from './SearchText';

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
    height: '100%',
    padding: '3rem 12%'
  },
  loadingContainer: {
    marginTop: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed',
    right: 0,
    bottom: 0,
    top: 0,
    left: 0
  },
  title: {
    marginBottom: '1rem'
  }
}));

const HelpView = ({ user }) => {
  const classes = useStyles();
  const {
    t,
    i18n: { language }
  } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    setLoading(true);
    getArticles(user, filter, 'SURVEY_BUILDER', language, [])
      .then(res => {
        const data = _.get(res, 'data.data.listArticles', []).filter(
          a => a.published
        );
        setArticles(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        enqueueSnackbar(t('views.support.failRequest'), { variant: 'error' });
      });
  }, [filter]);

  const handleGoArticle = articleId => {
    history.push(`/article/${articleId}`);
  };

  const onChangeFilterText = ({ key, target }) => {
    if (key === 'Enter') {
      setFilter(target.value);
    }
  };

  return (
    <div className={classes.container}>
      <Typography variant="h5" className={classes.title}>
        {t('views.support.collections.surveyBuilderDescription')}
      </Typography>
      <SearchText
        label={t('views.support.search')}
        onKeyDown={e => onChangeFilterText(e)}
      />
      {loading ? (
        <div className={classes.loadingContainer}>
          <CircularProgress />
        </div>
      ) : (
        <ArticlesList articles={articles} handleGoArticle={handleGoArticle} />
      )}
    </div>
  );
};

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(HelpView);
