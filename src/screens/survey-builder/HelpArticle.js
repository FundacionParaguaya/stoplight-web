import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import LightIcon from '@material-ui/icons/WbIncandescentOutlined';
import clsx from 'clsx';
import * as _ from 'lodash';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { getArticleById } from '../../api';

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.palette.background.default,
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    height: '100%'
  },
  loadingContainer: {
    marginTop: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  icon: {
    marginRight: theme.spacing(2),
    transform: 'rotate(180deg)',
    fontSize: 28,
    color: theme.palette.primary.dark
  },
  label: {
    marginTop: 10,
    marginBottom: 10
  },
  description: {
    color: theme.palette.grey.main
  },
  content: {
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto'
  }
}));

const HelpArticle = ({ section, user }) => {
  const classes = useStyles();
  const {
    t,
    i18n: { language }
  } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(true);
  const [article, setArticle] = useState({});

  useEffect(() => {
    setLoading(true);
    getArticleById(user, null, 'SURVEY_BUILDER', section, language)
      .then(response => {
        setLoading(false);
        let data = _.get(response, 'data.data.getArticleById', {});
        setArticle(data);
      })
      .catch(() => {
        setLoading(false);
        let errorMessage = t('views.surveyBuilder.helpArtilceNotFound').replace(
          '%s',
          section
        );
        enqueueSnackbar(errorMessage, { variant: 'error' });
      });
  }, []);

  return (
    <div className={classes.container}>
      {loading && (
        <div className={classes.loadingContainer}>
          <CircularProgress />
        </div>
      )}
      <div className={classes.titleContainer}>
        <LightIcon className={classes.icon} />
        <Typography variant="h5" className={classes.label}>
          {article.title}
        </Typography>
      </div>
      <Typography
        variant="h6"
        className={clsx(classes.label, classes.description)}
      >
        {article.description}
      </Typography>
      <div
        id="content"
        className={classes.defaultContentRich}
        dangerouslySetInnerHTML={{ __html: article.contentRich }}
      />
    </div>
  );
};

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(HelpArticle);
