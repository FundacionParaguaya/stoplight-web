import React from 'react';
import { IconButton, Typography, withStyles } from '@material-ui/core/';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import withLayout from '../components/withLayout';
import Container from '../components/Container';
import { useTranslation } from 'react-i18next';

import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined';
import { Grid } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';

const styles = theme => ({
  titleContainer: {
    //height: 225,
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
    fontWeight: 600
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
    backgroundColor: theme.palette.background.paper
  },
  sectionCard: {
    padding: 30,
    backgroundColor: theme.palette.background.default,
    display: 'flex'
  },
  container: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 26
  },
  sectionContainer: {
    maxWidth: '100%',
    width: '900px',
    marginLeft: 'auto',
    marginRight: 'auto'
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
  }
});

const Support = ({ classes, user }) => {
  const {
    t,
    i18n: { language }
  } = useTranslation();
  return (
    <div className={classes.mainContainer}>
      <div className={classes.titleContainer}>
        <Container variant="stretch">
          <div className={classes.content}>
            <div className={classes.headerMetaWrapper}>
              <Typography variant="h6" className={classes.headerMetaText}>
                {t('views.support.metaTitle')}
              </Typography>
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
                />
              </Paper>
            </div>
          </div>
        </Container>
      </div>
      <div className={classes.bodyContainer}>
        <div className={classes.container}>
          <div className={classes.sectionContainer}>
            <Paper
              variant="outlined"
              elevation={3}
              className={classes.sectionCard}
            >
              <Grid alignItems="center" container spacing={5}>
                <Grid item className={classes.iconContainer}>
                  {/* <HelpOutlineOutlinedIcon className={classes.icon} /> */}
                  <Icon className={classes.icon}>help_outline</Icon>
                </Grid>
                <Grid item className={classes.sectionCardBody}>
                  <Typography
                    variant="h5"
                    color="primary"
                    className={classes.cardTitle}
                  >
                    Preguntas Generales
                  </Typography>
                  <Typography variant="h6" className={classes.cardSubtitle}>
                    Preguntas generales sobre el Semáforo de Eliminación de
                    Pobreza
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    className={classes.cardBodyText}
                  >
                    6 articulos en esta recopilacion
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    className={classes.cardBodyText}
                  >
                    <span className={classes.cardBodySubText}>
                      Redactado por
                    </span>{' '}
                    Peter Green
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ user }) => ({ user });

export default withRouter(
  withStyles(styles)(connect(mapStateToProps)(withLayout(Support)))
);
