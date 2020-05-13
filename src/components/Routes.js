import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import { checkAccess } from '../utils/role-utils';
import Surveys from '../screens/SurveysWithDrafts';
import SurveyList from '../screens/Surveys';
import Organizations from '../screens/Organizations';
import Hubs from '../screens/Hubs';
import Lifemap from '../screens/Lifemap';
import FamilyProfile from '../screens/FamilyProfile';
import LifemapDetails from '../screens/LifemapDetails';
import SelectIndicatorPriority from '../screens/priorities/SelectIndicatorPriority';
import Families from '../screens/Families';
import Dashboard from '../screens/Dashboard';

const Routes = ({ user }) => {
  const pageNotFoundStyles = makeStyles(() => ({
    container: {
      display: 'flex',
      height: '100vh',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }));

  const classes = pageNotFoundStyles();

  let PageNotFound = () => (
    <div className={classes.container}> 404 - Page not found </div>
  );

  PageNotFound = withStyles(pageNotFoundStyles)(PageNotFound);

  return (
    <Switch>
      {checkAccess(user, 'surveys') && (
        <Route path="/surveys" component={Surveys} />
      )}
      {checkAccess(user, 'surveysList') && (
        <Route path="/surveysList" component={SurveyList} />
      )}
      {checkAccess(user, 'organizations') && (
        <Route path="/organizations" component={Organizations} />
      )}
      {checkAccess(user, 'hubs') && <Route path="/hubs" component={Hubs} />}
      {checkAccess(user, 'surveys') && (
        <Route path="/lifemap" component={Lifemap} />
      )}
      {checkAccess(user, 'families') && (
        <Route path="/families" component={Families} />
      )}
      {checkAccess(user, 'families') && (
        <Route path="/family/:familyId" component={FamilyProfile} />
      )}
      {checkAccess(user, 'detail') && (
        <Route path="/detail/:familyId" component={LifemapDetails} />
      )}
      {checkAccess(user, 'priorities') && (
        <Route
          path="/priorities/:familyId"
          component={SelectIndicatorPriority}
        />
      )}
      {checkAccess(user, 'dashboard') && (
        <Route path="/dashboard" component={Dashboard} />
      )}
      <Route component={PageNotFound} />
    </Switch>
  );
};

const mapStateToProps = ({ user }) => ({
  user
});

export default connect(mapStateToProps)(Routes);
