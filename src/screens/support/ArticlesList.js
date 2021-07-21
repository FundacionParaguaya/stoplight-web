import { Chip, Paper, Typography } from '@material-ui/core';

import Grid from '@material-ui/core/Grid';
import React from 'react';
import { getDateFormatByLocale } from '../../utils/date-utils';
import moment from 'moment';
import { withStyles } from '@material-ui/styles';
import { withTranslation } from 'react-i18next';

const styles = theme => ({
  sectionCard: {
    width: '100%',
    marginTop: 16,
    padding: 30,
    backgroundColor: theme.palette.background.default,
    cursor: 'pointer'
  },
  cardTitle: {
    fontSize: 18
  },
  cardSubtitle: {
    margin: '5px 0px 11px',
    color: theme.palette.grey.main
  },
  cardBodyText: {
    color: '#626262'
  },
  cardBodySubText: {
    color: theme.palette.text.light
  }
});

const ArticleList = ({
  articles,
  handleGoArticle,
  classes,
  t,
  i18n: { language },
  ...props
}) => {
  const dateFormat = getDateFormatByLocale(language);
  return (
    <React.Fragment>
      {articles.map(article => {
        return (
          <Paper
            key={article.id}
            variant="outlined"
            elevation={3}
            className={classes.sectionCard}
            onClick={() => handleGoArticle(article.id)}
          >
            <div>
              <Typography
                variant="h5"
                color="primary"
                className={classes.cardTitle}
              >
                {article.title}
              </Typography>
              <Typography variant="h6" className={classes.cardSubtitle}>
                {article.description}
              </Typography>
              <Grid container spacing={1}>
                <Grid item md={4} sm={4} xs={12}>
                  <Typography
                    variant="subtitle2"
                    className={classes.cardBodyText}
                  >
                    <span className={classes.cardBodySubText}>
                      {t('views.support.createdAt')}
                    </span>{' '}
                    {moment(article.createdAt).format(dateFormat)}
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
                <Grid item md={8} sm={8} xs={12}>
                  {!article.published && (
                    <Chip label={t('views.support.noPublish')} disabled />
                  )}
                </Grid>
              </Grid>
            </div>
          </Paper>
        );
      })}
    </React.Fragment>
  );
};

export default withStyles(styles)(withTranslation()(ArticleList));
