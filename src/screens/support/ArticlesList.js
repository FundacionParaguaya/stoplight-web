import React from 'react';
import { withStyles } from '@material-ui/styles';
import { withTranslation } from 'react-i18next';
import { Paper, Typography } from '@material-ui/core';
import { getDateFormatByLocale } from '../../utils/date-utils';
import moment from 'moment';

const styles = theme => ({
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
    <div>
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
              <Typography variant="subtitle2" className={classes.cardBodyText}>
                <span className={classes.cardBodySubText}>
                  {t('views.support.createdAt')}
                </span>{' '}
                {moment(article.createdAt).format(dateFormat)}
              </Typography>

              <Typography variant="subtitle2" className={classes.cardBodyText}>
                <span className={classes.cardBodySubText}>
                  {t('views.support.writeBy')}
                </span>{' '}
                {t('views.support.team')}
              </Typography>
            </div>
          </Paper>
        );
      })}
    </div>
  );
};

export default withStyles(styles)(withTranslation()(ArticleList));
