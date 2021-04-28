import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import withLayout from '../../components/withLayout';
import { CircularProgress, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import Container from '../../components/Container';
import { getArticleById } from '../../api';
import { useParams } from 'react-router';
import * as _ from 'lodash';

import NavigationBar from '../../components/NavigationBar';

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
  headerMetaText: {
    color: theme.palette.background.default,
    fontWeight: 600
  },
  headerMetaWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  bodyContainer: {},
  sectionContainer: {
    maxWidth: '100%',
    width: '900px',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: 20,
    paddingRight: 20
  },
  detailContainer: {
    padding: 60,
    backgroundColor: theme.palette.background.default
  },
  label: {
    marginTop: 10,
    marginBottom: 10,
    width: '100%'
  },
  content: {
    maxWidth: '100%',
    width: 900,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  navigationContainer: {
    paddingTop: 20,
    paddingBottom: 20
  }
});

const ArticleView = ({ classes, user }) => {
  const { id } = useParams();
  const [article, setArticle] = useState({});
  const [loading, setLoading] = useState(false);
  const {
    t,
    i18n: { language }
  } = useTranslation();

  useEffect(() => {
    setLoading(true);
    getArticleById(user, id)
      .then(response => {
        console.log('r', response);
        const data = _.get(response, 'data.data.getArticleById', {});
        setArticle(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const collection = article.collection
    ? article.collection.toLowerCase()
    : null;

  const navigationOptions = [
    { label: t('views.support.allCollections'), link: '/support' },
    { label: collection, link: `/collection/${collection}` },
    { label: t('views.support.article'), link: `/articles/${id}` }
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
            </div>
          </div>
        </Container>
      </div>
      <div className={classes.sectionContainer}>
        <div className={classes.navigationContainer}>
          <NavigationBar options={navigationOptions} />
        </div>

        <div className={classes.detailContainer}>
          <Typography variant="h4" className={classes.label}>
            {article.title}
          </Typography>
          <Typography variant="h6" className={classes.label}>
            {article.description}
          </Typography>
          <div
            id="content"
            className={classes.defaultContentRich}
            dangerouslySetInnerHTML={{ __html: article.contentRich }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ user }) => ({ user });

export default withStyles(styles)(
  connect(mapStateToProps)(withLayout(ArticleView))
);
