import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter, useParams } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import { updateUser, updateSurvey, updateDraft } from '../../redux/actions';
import withLayout from '../../components/withLayout';
import DimensionQuestion from '../../components/summary/DimensionQuestion';
import { Typography } from '@material-ui/core';
import Container from '../../components/Container';
import iconPriority from '../../assets/icon_priority.png';

const styles = theme => ({
  questionsContainer: {
    padding: '45px',
    paddingBottom: 0
  },
  basicInfo: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    justifyContent: 'center',
    zIndex: 9,
    marginTop: '3rem'
    //position: 'relative'
  },
  basicInfoText: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconPriorityBorder: {
    border: '2px solid #FFFFFF',
    borderRadius: '50%',
    backgroundColor: '#FFFFFF',
    minWidth: 90,
    minHeight: 90,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '-2%',
    position: 'relative'
  },
  iconPriority: {
    maxWidth: 50,
    maxHeight: 50,
    objectFit: 'contain'
  }
});

const SelectIndicatorPriority = ({
  classes,
  t,
  i18n: { language },
  history
}) => {
  const questions = [
    {
      value: 1,
      questionText: 'Question Text',
      dimension: 'Dimension',
      key: '1'
    },
    {
      value: 2,
      questionText: 'Question Text 2',
      dimension: 'Dimension 2',
      key: '2'
    },
    {
      value: 3,
      questionText: 'Question Text 3',
      dimension: 'Dimension 3',
      key: '3'
    }
  ];
  return (
    <div>
      <Container className={classes.basicInfo} variant="fluid">
        <div className={classes.iconPriorityBorder}>
          <img
            src={iconPriority}
            className={classes.iconPriority}
            alt="Priority icon"
          />
        </div>
      </Container>

      <Container className={classes.basicInfoText} variant="fluid">
        <Typography variant="h5">Seleccione un indicador</Typography>
      </Container>
      <div className={classes.questionsContainer}>
        <DimensionQuestion
          questions={questions}
          priorities={[]}
          achievements={[]}
          history={history}
        />
      </div>
    </div>
  );
};

const mapStateToProps = ({ user }) => ({ user });

const mapDispatchToProps = { updateUser, updateSurvey, updateDraft };

export default withRouter(
  withStyles(styles)(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(withTranslation()(withLayout(SelectIndicatorPriority)))
  )
);
