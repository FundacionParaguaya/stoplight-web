import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import NavIcons from './NavIcons';
import leftBarDots from '../assets/left_bar_dots.png';
import rightBarDots from '../assets/right_bar_dots.png';
import Container from './Container';
import ProgressBar from './ProgressBar';

class TopTitleContainer extends Component {
  state = {
    showLeaveModal: false
  };

  leaveSurvey = () => {
    this.props.history.push('/surveys');
  };

  render() {
    const { classes, t } = this.props;

    return (
      <React.Fragment>
        {this.state.showLeaveModal ? (
          <div className={classes.leaveModal}>
            <Typography className={classes.leaveModalTitle} variant="h5">
              {t('views.modals.yourLifemapIsNotComplete')}
            </Typography>
            <div className={classes.buttonContainer}>
              <Button
                className={classes.button}
                fullWidth
                onClick={() => this.setState({ showLeaveModal: false })}
              >
                {t('general.no')}
              </Button>
              <Button
                className={classes.button}
                color="primary"
                variant="contained"
                fullWidth
                onClick={this.leaveSurvey}
              >
                {t('general.yes')}
              </Button>{' '}
            </div>
          </div>
        ) : (
          <Container variant="fluid" className={classes.container}>
            {this.props.showButton && (
              <NavIcons style={{ position: 'absolute' }} />
            )}
            <Container className={classes.innerContainer}>
              <img
                className={classes.barDots}
                src={leftBarDots}
                alt="Bar Dots"
              />
              <div className={classes.textContainer}>
                {this.props.extraTitleText && (
                  <Typography
                    variant="subtitle1"
                    className={classes.extraTitleText}
                  >
                    {this.props.extraTitleText}
                  </Typography>
                )}
                <Typography
                  variant="h4"
                  test-id="title-bar"
                  className={classes.titleMainAll}
                >
                  {this.props.title}
                </Typography>
              </div>
              <img
                className={classes.barDots}
                src={rightBarDots}
                alt="Bar Dots"
              />
            </Container>
            {this.props.progressBar && <ProgressBar />}
          </Container>
        )}
      </React.Fragment>
    );
  }
}

TopTitleContainer.propTypes = {
  title: PropTypes.string.isRequired,
  extraTitleText: PropTypes.string,
  progressBar: PropTypes.bool.isRequired
};

TopTitleContainer.defaultProps = {
  progressBar: false,
  showButton: true
};

const mapStateToProps = ({ currentSurvey }) => ({ currentSurvey });

const styles = theme => ({
  button: {
    margin: '0 30px',
    width: '100px'
  },
  leaveModalTitle: {
    marginTop: '40px',
    marginBottom: '40px'
  },
  buttonContainer: {
    display: 'flex'
  },
  leaveModal: {
    height: '100vh',
    width: '720px',
    position: 'fixed',
    zIndex: 2,
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  container: {
    backgroundColor: theme.palette.background.default,
    borderBottom: '1px solid #DCDEE3;',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down('xs')]: {
      minHeight: '70%'
    }
  },
  innerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxHeight: 180
  },
  titleMainAll: {
    margin: 'auto',
    zIndex: 1,
    textAlign: 'center',
    [theme.breakpoints.down('xs')]: {
      fontSize: 24,
      lineHeight: 1.2
    }
  },
  barDots: {
    height: '70%',
    objectFit: 'contain',
    [theme.breakpoints.down('xs')]: {
      height: '50%',
      paddingTop: '20px'
    }
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  extraTitleText: {
    textAlign: 'center',
    fontWeight: 400,
    textTransform: 'uppercase',
    color: 'rgba(0,0,0,0.5)',
    marginBottom: 10,
    lineHeight: '25px',
    [theme.breakpoints.down('xs')]: {
      fontSize: 14,
      lineHeight: 1.2
    }
  },
  navIcons: {
    position: 'absolute'
  }
});
export default withRouter(
  withStyles(styles)(
    connect(mapStateToProps)(withTranslation()(TopTitleContainer))
  )
);
