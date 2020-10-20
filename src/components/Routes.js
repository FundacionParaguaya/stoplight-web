import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { checkAccess, checkAccessToSolution } from '../utils/role-utils';
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
import Users from '../screens/Users';
import Reports from '../screens/Reports';
import Maps from '../screens/Maps';
import Login from '../screens/Login';
import PageNotFound from '../screens/PageNotFound';
import ErrorBoundary from './ErrorBoundary';
import Solutions from '../screens/Solutions';
import SolutionsForm from '../screens/solutions/SolutionsForm';
import SolutionsView from '../screens/solutions/SolutionsView';
import EditPrimaryParticipantForm from '../screens/families/edit/EditPrimaryParticipantForm';
import EditFamilyMembersForm from '../screens/families/edit/EditFamilyMembersForm';
import EditLocation from '../screens/families/edit/EditLocation';
import OrganizationForm from '../screens/organizations/OrganizationForm';
import EditEconomicForm from '../screens/families/edit/EditEconomicForm';

const Routes = ({ user }) => {
  return (
    <ErrorBoundary>
      <Switch>
        {checkAccess(user, 'surveys') && (
          <Route
            path={['/surveys', '/login', '/login.html']}
            component={Surveys}
          />
        )}
        {checkAccess(user, 'surveysList') && (
          <Route path="/surveysList" component={SurveyList} />
        )}
        {checkAccess(user, 'organizations') && (
          <Route path="/organizations" component={Organizations} />
        )}
        {checkAccess(user, 'organizationEdit') && (
          <Route path="/organization/create" component={OrganizationForm} />
        )}
        {checkAccess(user, 'organizationEdit') && (
          <Route
            path="/organization/:orgId/edit"
            component={OrganizationForm}
          />
        )}
        {checkAccess(user, 'hubs') && <Route path="/hubs" component={Hubs} />}
        {checkAccess(user, 'surveys') && (
          <Route path="/lifemap" component={Lifemap} />
        )}
        {checkAccess(user, 'families') && (
          <Route path="/families" component={Families} />
        )}
        {checkAccess(user, 'families') && (
          <Route exact path="/family/:familyId" component={FamilyProfile} />
        )}
        {checkAccess(user, 'editFamily') && (
          <Route
            path="/family/:familyId/edit"
            component={EditPrimaryParticipantForm}
          />
        )}
        {checkAccess(user, 'editFamily') && (
          <Route
            path="/family/:familyId/edit-economic/:topic"
            component={EditEconomicForm}
          />
        )}
        {checkAccess(user, 'editFamily') && (
          <Route
            path="/family/:familyId/edit-members"
            component={EditFamilyMembersForm}
          />
        )}
        {checkAccess(user, 'editFamily') && (
          <Route
            path="/family/:familyId/edit-location/:latitude/:longitude"
            component={EditLocation}
          />
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
          <Route
            path={['/dashboard', '/login', '/login.html']}
            component={Dashboard}
          />
        )}
        {checkAccess(user, 'users') && (
          <Route path="/users" component={Users} />
        )}
        {checkAccess(user, 'reports') && (
          <Route path="/reports" component={Reports} />
        )}
        {checkAccess(user, 'map') && <Route path="/map" component={Maps} />}
        {checkAccessToSolution(user, 'solutions') && (
          <Route path="/solutions/create" component={SolutionsForm} />
        )}
        {checkAccessToSolution(user, 'solutions') && (
          <Route path="/solution/edit/:id" component={SolutionsForm} />
        )}
        {checkAccessToSolution(user) && (
          <Route path="/solution/:id" component={SolutionsView} />
        )}
        {checkAccessToSolution(user) && (
          <Route path="/solutions" component={Solutions} />
        )}
        {!user.role && <Route path="/login" component={Login} />}

        {checkAccess(user, 'dashboard') && (
          <Route exact path="/" component={Dashboard} />
        )}
        {checkAccess(user, 'surveys') && (
          <Route exact path="/" component={Surveys} />
        )}

        {!!user.role && <Route render={() => <PageNotFound user={user} />} />}
      </Switch>
    </ErrorBoundary>
  );
};

const mapStateToProps = ({ user }) => ({
  user
});

export default connect(mapStateToProps)(Routes);
