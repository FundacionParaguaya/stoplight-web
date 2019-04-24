import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import { theme } from '../theme';
import { withTranslation } from 'react-i18next';
import LeaveModal from '../components/LeaveModal';

class NavIcons extends Component {
  state = {
    showLeaveModal: false
  };
  handleClose = () => {
    this.setState({ showLeaveModal: false });
  };
  leaveSurvey = () => {
    this.props.history.push('/surveys');
  };
  render() {
    const { classes, t } = this.props;

    return (
      <React.Fragment>
        <div className={classes.container}>
          <i
            onClick={this.props.uniqueBack || this.props.history.goBack}
            className={`material-icons ${classes.icon}`}
          >
            arrow_back
          </i>
          <h2 className={classes.titleMainAll}>{this.props.title}</h2>
          <i
            className={`material-icons ${classes.icon}`}
            onClick={() => this.setState({ showLeaveModal: true })}
          >
            close
          </i>
        </div>
        <LeaveModal
          title="Warning!"
          subtitle={t('views.modals.yourLifemapIsNotComplete')}
          cancelButtonText={t('general.no')}
          continueButtonText={t('general.yes')}
          onClose={this.handleClose}
          open={this.state.showLeaveModal}
          leaveAction={this.leaveSurvey}
        />
      </React.Fragment>
    );
  }
}

const styles = {
  container: {
    width: '100%',
    padding: 25,
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'flex',
    justifyContent: 'space-between'
  },
  icon: {
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: theme.palette.primary.main,
      color: '#fff',
      borderRadius: '50%',
      boxSizing: 'border-box'
    },
    borderRadius: '50%',
    color: theme.palette.primary.main,
    width: 50,
    height: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};

export default withRouter(withStyles(styles)(withTranslation()(NavIcons)));
