import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import { Typography, Button } from '@material-ui/core';
import checkboxWithDots from '../../assets/checkbox_with_dots.png';
import { theme } from '../../theme';
import NavIcons from '../../components/NavIcons';
import Container from '../../components/Container';
import BottomSpacer from '../../components/BottomSpacer';
import LeaveModal from '../../components/LeaveModal';

const titleStyles = muiTheme => ({
  title: {
    position: 'relative',
    top: '55%',
    zIndex: 1
  },
  termsCheckboxImage: {
    margin: 'auto',
    position: 'absolute',
    right: 0,
    bottom: '-10%',
    width: '35%',
    [muiTheme.breakpoints.down('sm')]: {
      bottom: '50%',
      transform: 'translateY(50%)',
      width: '60%',
      zIndex: 0
    }
  },
  container: {
    position: 'absolute',
    top: 0,
    height: '100%',
    left: '50%',
    transform: 'translateX(-50%)'
  }
});

const TitleContainer = withStyles(titleStyles)(props => {
  const { classes } = props;

  return (
    <Container className={classes.container}>
      <Typography className={classes.title} variant="h4">
        {props.title}
      </Typography>
      <img
        src={checkboxWithDots}
        className={classes.termsCheckboxImage}
        alt=""
      />
    </Container>
  );
});

export class Terms extends Component {
  state = {
    title:
      this.props.location.pathname === '/lifemap/terms'
        ? this.props.currentSurvey.termsConditions.title
        : this.props.currentSurvey.privacyPolicy.title,
    text:
      this.props.location.pathname === '/lifemap/terms'
        ? this.props.currentSurvey.termsConditions.text
        : this.props.currentSurvey.privacyPolicy.text,
    showLeaveModal: false
  };

  handleContinue = () => {
    window.onbeforeunload = () => null;
    this.props.history.push(
      this.props.location.pathname === '/lifemap/terms'
        ? '/lifemap/privacy'
        : '/lifemap/primary-participant'
    );
  };

  handleDisagree = () => {
    this.setState({ showLeaveModal: true });
  };

  leaveSurvey = () => {
    if (this.props.currentDraft && this.props.currentDraft.isRetake) {
      const familyId = this.props.currentDraft.familyData.familyId;
      this.props.history.push(`/family/${familyId}`);
    } else {
      this.props.history.push('/surveys');
    }
  };

  render() {
    const { classes, t } = this.props;

    return (
      <div>
        {this.props.location.pathname === '/lifemap/terms' ? (
          <div className={classes.titleContainer}>
            <NavIcons />
            <TitleContainer title={t('views.termsConditions')} />
          </div>
        ) : (
          <div className={classes.titleContainer}>
            <NavIcons />
            <TitleContainer title={t('views.privacyPolicy')} />
          </div>
        )}
        <Container>
          <div className={classes.contentContainer}>
            <Typography variant="h5">{this.state.title}</Typography>
            <br />
            {this.state.text &&
              this.state.text.split(/(?:\\n)/g).map((i, key) => (
                <Typography
                  style={{ fontSize: 18 }}
                  color="textPrimary"
                  key={key}
                >
                  {i}
                  <br />
                </Typography>
              ))}
          </div>
        </Container>
        <div className={classes.buttonContainerTerms}>
          <Button variant="text" onClick={this.handleDisagree}>
            {t('general.disagree')}
          </Button>
          <Button
            variant="contained"
            onClick={this.handleContinue}
            test-id="agree"
          >
            {t('general.agree')}
          </Button>
        </div>
        <BottomSpacer />
        <LeaveModal
          title="Warning!"
          subtitle={t('views.modals.yourLifemapIsNotComplete')}
          cancelButtonText={t('general.no')}
          continueButtonText={t('general.yes')}
          onClose={() => this.setState({ showLeaveModal: false })}
          open={this.state.showLeaveModal}
          leaveAction={this.leaveSurvey}
        />
      </div>
    );
  }
}
const styles = {
  titleContainer: {
    height: 220,
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'hidden'
  },
  buttonTermsDisagree: {
    '&:hover': {
      backgroundColor: 'transparent'
    },
    textTransform: 'capitalize',
    textDecoration: 'underline'
  },
  buttonTermsAgree: {
    width: 260,
    margin: '0 10px'
  },
  buttonContainerTerms: {
    display: 'flex',
    justifyContent: 'center'
  },
  lowerTitle: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 15
  },
  contentContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'column',
    textAlign: 'justify',
    paddingTop: theme.shape.padding,
    maxWidth: 660
  },
  list: {
    display: 'flex',
    flexDirection: 'column'
  },
  divider1: {
    width: '100%',
    height: 20
  }
};

const mapStateToProps = ({ currentSurvey, currentDraft }) => ({
  currentSurvey,
  currentDraft
});
export default withStyles(styles)(
  connect(mapStateToProps)(withTranslation()(Terms))
);
