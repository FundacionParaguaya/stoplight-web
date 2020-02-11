import React, { useState, createContext, useContext } from 'react';
import { withStyles } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { COLORS } from '../theme';

// Screens:
// PrimaryParticipant (1)
// Location (1)
// Economics (Variable)
// FamilyMembers (1 or 0)
// BeginStoploght (1)
// StoplightQuestions (Variable)
// SkippedQuestions (1 or 0)
// Overview (1)
// Final (1)

// We create a context because the ProgressBar as currently implemented is re-renderer in every screen
// and so the state if it was local and also the buildRouteTree() function that's is somewhat perf expensive
export const ProgressBarContext = createContext({});
export const ProgressBarProvider = props => {
  const [routeTree, setRouteTree] = useState({});

  return (
    <ProgressBarContext.Provider value={{ routeTree, setRouteTree }}>
      {props.children}
    </ProgressBarContext.Provider>
  );
};

export const addLeaves = (tree, leaves) => {
  let newTree = tree;
  let counter = 0;

  // If we the currentTree is not empty, we start counting since the length
  if (Object.entries(tree).length !== 0) {
    counter = Object.keys(tree).length;
  }

  leaves.forEach(leave => {
    newTree = Object.assign({}, newTree, { [leave]: counter });
    counter += 1;
  });

  return newTree;
};

export const buildRouteTree = (currentSurvey, currentTree) => {
  let newTree = currentTree;

  // Two first screens
  const primaryLeaves = ['primary-participant', 'family-members', 'location'];
  newTree = addLeaves(newTree, primaryLeaves);

  // Economic Screens
  const economicLeaves = currentSurvey.economicScreens.questionsPerScreen.map(
    (question, index) => `economics/${index}`
  );
  newTree = addLeaves(newTree, economicLeaves);

  // Begin Stoplight
  newTree = addLeaves(newTree, ['begin-stoplight']);

  // Upload pictures
  //newTree = addLeaves(newTree, ['upload-pictures']);

  // Question Screens
  const questionLeaves = currentSurvey.surveyStoplightQuestions.map(
    (question, index) => `stoplight/${index}`
  );
  newTree = addLeaves(newTree, questionLeaves);

  // Last screens
  const finalLeaves = ['skipped-questions', 'overview', 'final'];
  newTree = addLeaves(newTree, finalLeaves);

  return newTree;
};

const ProgressBar = props => {
  const { routeTree, setRouteTree } = useContext(ProgressBarContext);
  const { classes, style, location } = props;
  const pathname = location.pathname.replace('/lifemap/', '');

  const getProgress = (screens, currentScreen) => {
    if (Object.keys(screens).length === 0) {
      return 0;
    }
    // If screens is 100, currentScreen is X
    return (currentScreen * 100) / (Object.keys(screens).length - 1);
  };

  if (Object.entries(routeTree).length === 0) {
    setRouteTree(prev => buildRouteTree(props.currentSurvey, prev));
  }

  return (
    <div className={classes.container} style={style}>
      <div className={classes.barBackground}>
        <div
          className={classes.bar}
          style={{ width: `${getProgress(routeTree, routeTree[pathname])}%` }}
        />
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    height: 12,
    paddingRight: 40,
    paddingLeft: 40,
    marginBottom: 15
  },
  barBackground: {
    backgroundColor: '#d8d8d8',
    height: '100%',
    width: '100%',
    borderRadius: 10,
    orverflow: 'hidden'
  },
  bar: {
    backgroundColor: COLORS.GREEN,
    height: '100%',
    borderRadius: 10,
    transition: 'width 200ms ease'
  }
};

const mapStateToProps = ({ currentSurvey, currentDraft }) => ({
  currentSurvey,
  currentDraft
});

export default connect(mapStateToProps)(
  withRouter(withStyles(styles)(ProgressBar))
);
