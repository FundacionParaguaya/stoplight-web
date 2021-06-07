import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import { Typography, Button } from '@material-ui/core';
import checkboxWithDots from '../../assets/checkbox_with_dots.png';
import Container from '../../components/Container';
import withLayout from '../../components/withLayout';
import { withRouter } from 'react-router-dom';
import Editor from '../../components/Editor';
import Grid from '@material-ui/core/Grid';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Divider from '../../components/Divider';
import OrganizationsFilter from '../../components/OrganizationsFilter';

const styles = theme => ({
  mainContainer: {
    backgroundColor: theme.palette.background.paper
  },
  title: {
    fontSize: 24,
    lineHeight: 1.4,
    paddingTop: 30
  },
  label: {
    paddingBottom: 10
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.paper
  },
  infoContainer: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.default,
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 20,
    marginBottom: 20
  },
  inforContainer: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: theme.palette.background.default,
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 20,
    marginBottom: 20
  },
  outlinedInputContainer: {
    marginBottom: 20
  },
  outlinedInput: {},
  divider: {
    height: '100%',
    width: 2,
    backgroundColor: theme.palette.background.paper
  }
});

const Info = ({ classes, t, user }) => {
  return (
    <div className={classes.mainContainer}>
      <Container className={classes.container}>
        <Typography className={classes.title} variant="h4">
          {'Surveys Info'}
        </Typography>
        <Grid container style={{ width: 'auto' }} spacing={2}>
          <div className={classes.inforContainer} style={{ width: '100%' }}>
            <Grid item md={6} sm={6} xs={6}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Typography className={classes.label} variant="subtitle1">
                  {'Title'}
                </Typography>
                <Typography className={classes.label} variant="subtitle1">
                  {'Country'}
                </Typography>
                <Typography className={classes.label} variant="subtitle1">
                  {'Language'}
                </Typography>
              </div>
            </Grid>
            <Grid item md={6} sm={6} xs={6}>
              <div className={classes.divider} />
            </Grid>
          </div>
        </Grid>
        <Typography className={classes.title} variant="h4">
          {'Privacy Policy'}
        </Typography>
        <div className={classes.infoContainer}>
          <Typography className={classes.label} variant="subtitle1">
            {'Subtitle'}
          </Typography>
          <OutlinedInput
            classes={{
              root: classes.outlinedInputContainer,
              input: classes.outlinedInput
            }}
            placeholder={t('views.familyNotes.NotePlaceHolder')}
            multiline={true}
            value={'subtitulo'}
            inputProps={{ maxLength: '10000' }}
            onChange={() => {}}
            margin="dense"
          />
          <Typography className={classes.label} variant="subtitle1">
            {'Text'}
          </Typography>
          <OutlinedInput
            classes={{
              root: classes.outlinedInputContainer,
              input: classes.outlinedInput
            }}
            placeholder={t('views.familyNotes.NotePlaceHolder')}
            multiline={true}
            value={'texto'}
            inputProps={{ maxLength: '10000' }}
            onChange={() => {}}
            margin="dense"
          />
        </div>
        <Typography className={classes.title} variant="h4">
          {'Terms And Conditions'}
        </Typography>
        <div className={classes.infoContainer}>
          <Typography className={classes.label} variant="subtitle1">
            {'Subtitle'}
          </Typography>
          <OutlinedInput
            classes={{
              root: classes.outlinedInputContainer,
              input: classes.outlinedInput
            }}
            placeholder={t('views.familyNotes.NotePlaceHolder')}
            multiline={true}
            value={'subtitulo'}
            inputProps={{ maxLength: '10000' }}
            onChange={() => {}}
          />
          <Typography className={classes.label} variant="subtitle1">
            {'Text'}
          </Typography>
          <OutlinedInput
            classes={{
              root: classes.outlinedInputContainer,
              input: classes.outlinedInput
            }}
            placeholder={t('views.familyNotes.NotePlaceHolder')}
            multiline={true}
            value={'texto'}
            inputProps={{ maxLength: '10000' }}
            onChange={() => {}}
            margin="dense"
          />
        </div>
      </Container>
    </div>
  );
};

export default withStyles(styles)(
  withRouter(withTranslation()(withLayout(Info)))
);
