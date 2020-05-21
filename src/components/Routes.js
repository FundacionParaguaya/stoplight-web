import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
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
import PageNotFound from '../screens/PageNotFound';

const Routes = ({ user }) => {
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
      <Route render={() => <PageNotFound user={user} />} />
    </Switch>
  );
};

const mapStateToProps = ({ user }) => ({
  user
});

export default connect(mapStateToProps)(Routes);
