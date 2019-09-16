import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { theme } from '../theme';
import LeaveModal from './LeaveModal';
import SaveDraftModal from './SaveDraftModal';
import { ROLE_SURVEY_TAKER } from '../utils/role-utils';

class NavIcons extends Component {
  state = {
    showLeaveModal: false
  };

  canSaveDraft = () => {
    let doDraft = false;
    const {
      currentDraft = {},
      user: { role }
    } = this.props;
    if (
      get(currentDraft, 'familyData.familyMembersList[0].firstName', null) &&
      get(currentDraft, 'familyData.familyMembersList[0].lastName', null) &&
      role !== ROLE_SURVEY_TAKER
    ) {
      doDraft = true;
    }
    return doDraft;
  };

  handleClose = () => {
    this.setState({ showLeaveModal: false });
  };

  leaveSurvey = () => {
    this.props.history.push('/surveys');
  };

  render() {
    const { classes, t, style } = this.props;

    return (
      <React.Fragment>
        <div className={classes.container} style={style}>
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
          open={this.state.showLeaveModal && !this.canSaveDraft()}
          leaveAction={this.leaveSurvey}
        />
        <SaveDraftModal
          onClose={this.handleClose}
          open={this.state.showLeaveModal && this.canSaveDraft()}
        />
      </React.Fragment>
    );
  }
}

const styles = {
  container: {
    width: '100%',
    padding: 25,
    position: 'relative',
    top: 0,
    left: 0,
    display: 'flex',
    justifyContent: 'space-between',
    zIndex: 1
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

const mapStateToProps = ({ currentDraft, user }) => ({ currentDraft, user });
const mapDispatchToProps = {};

export default withRouter(
  withStyles(styles)(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(withTranslation()(NavIcons))
  )
);
