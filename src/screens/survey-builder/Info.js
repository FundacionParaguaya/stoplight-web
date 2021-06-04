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
import withLayout from '../../components/withLayout';
import { withRouter } from 'react-router-dom';

const titleStyles = muiTheme => ({
  title: {
    position: 'relative',
    top: '55%',
    zIndex: 1,
    [muiTheme.breakpoints.down('sm')]: {
      width: '180px',
      fontSize: 24,
      lineHeight: 1.4,
      left: '10%'
    }
  },
  termsCheckboxImage: {
    margin: 'auto',
    position: 'absolute',
    right: 0,
    bottom: '-10%',
    width: '35%',
    [muiTheme.breakpoints.down('md')]: {
      transform: 'translateY(50%)',
      width: '33%',
      right: '5%',
      zIndex: 0
    },
    [muiTheme.breakpoints.down('xs')]: {
      top: '45%',
      left: '58%',
      transform: 'translateY(50%)',
      width: '35%',
      zIndex: 0
    },
    [muiTheme.breakpoints.down('xl')]: {
      bottom: '50%',
      transform: 'translateY(50%)',
      width: '35%',
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

export class Info extends Component {
  state = {
    title: 'titulo',
    // this.props.location.pathname === '/lifemap/terms'
    //   ? this.props.currentSurvey.termsConditions.title
    //   : this.props.currentSurvey.privacyPolicy.title,
    text: 'texto',
    // this.props.location.pathname === '/lifemap/terms'
    //   ? this.props.currentSurvey.termsConditions.text
    //   : this.props.currentSurvey.privacyPolicy.text,
    showLeaveModal: false
  };

  render() {
    const { classes, t } = this.props;

    return (
      <div>
        <TitleContainer title={t('views.privacyPolicy')} />
      </div>
    );
  }
}
const styles = muiTheme => ({
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
});

const mapStateToProps = ({ currentSurvey, currentDraft }) => ({
  currentSurvey,
  currentDraft
});
// export default withLayout(withTranslation(Info));

export default withRouter(withTranslation()(withLayout(Info)));
