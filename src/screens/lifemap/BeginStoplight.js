import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import TitleBar from '../../components/TitleBar';
import beginLifemap from '../../assets/begin_lifemap.png';
import BottomSpacer from '../../components/BottomSpacer';
import Container from '../../components/Container';

export class Begin extends Component {
  render() {
    const { classes, t, currentSurvey } = this.props;
    const questions = currentSurvey.surveyStoplightQuestions.length;
    return (
      <div>
        <TitleBar title={t('views.yourLifeMap')} progressBar />
        <Container
          variant="stretch"
          className={classes.BeginStopLightContainer}
        >
          <Typography variant="h5" className={classes.StopLightTitleContainer}>
            {t('views.lifemap.thisLifeMapHas').replace('%n', questions)}
          </Typography>
          <img
            className={classes.beginStopLightImage}
            src={beginLifemap}
            alt=""
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => this.props.history.push('/lifemap/stoplight/0')}
            style={{ color: 'white' }}
          >
            {t('general.continue')}
          </Button>
          <BottomSpacer />
        </Container>
      </div>
    );
  }
}

const mapStateToProps = ({ currentSurvey }) => ({ currentSurvey });

const styles = {
  BeginStopLightContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  StopLightTitleContainer: {
    width: '50%',
    margin: '50px auto 0 auto',
    textAlign: 'center'
  },
  beginStopLightImage: {
    marginTop: 40,
    marginBottom: 80,
    position: 'relative',
    left: -10
  }
};

export default withStyles(styles)(
  connect(mapStateToProps)(withTranslation()(Begin))
);
