import 'firebase/analytics';

import React, { Suspense, lazy, useEffect } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import {
  checkAccess,
  checkAccessToInterventions,
  checkAccessToProjects,
  checkAccessToSolution
} from '../utils/role-utils';

import CircularProgress from '@material-ui/core/CircularProgress';
import { connect } from 'react-redux';
import firebase from 'firebase';

const DimensionsView = lazy(() => import('../screens/Dimensions'));
const Support = lazy(() => import('../screens/Support'));
const SupportForm = lazy(() => import('../screens/support/SupportForm'));
const CollectionView = lazy(() => import('../screens/support/CollectionView'));
const ArticleView = lazy(() => import('../screens/support/ArticleView'));
const Surveys = lazy(() => import('../screens/SurveysWithDrafts'));
const SurveyList = lazy(() => import('../screens/Surveys'));
const Organizations = lazy(() => import('../screens/Organizations'));
const Hubs = lazy(() => import('../screens/Hubs'));
const Lifemap = lazy(() => import('../screens/Lifemap'));
const Builder = lazy(() => import('../screens/Builder'));
const FamilyProfile = lazy(() => import('../screens/FamilyProfile'));
const LifemapDetails = lazy(() => import('../screens/LifemapDetails'));
const SelectIndicatorPriority = lazy(() =>
  import('../screens/priorities/SelectIndicatorPriority')
);
const SelectIndicatorAchievement = lazy(() =>
  import('../screens/achievements/SelectIndicatorAchievement')
);
const Families = lazy(() => import('../screens/Families'));
const Dashboard = lazy(() => import('../screens/Dashboard'));
const Users = lazy(() => import('../screens/Users'));
const Reports = lazy(() => import('../screens/Reports'));
const Maps = lazy(() => import('../screens/Maps'));
const Login = lazy(() => import('../screens/Login'));
const PageNotFound = lazy(() => import('../screens/PageNotFound'));
const ErrorBoundary = lazy(() => import('./ErrorBoundary'));
const Solutions = lazy(() => import('../screens/Solutions'));
const SolutionsForm = lazy(() => import('../screens/solutions/SolutionsForm'));
const SolutionsView = lazy(() => import('../screens/solutions/SolutionsView'));
const EditPrimaryParticipantForm = lazy(() =>
  import('../screens/families/edit/EditPrimaryParticipantForm')
);
const EditFamilyMembersForm = lazy(() =>
  import('../screens/families/edit/EditFamilyMembersForm')
);
const EditLocation = lazy(() =>
  import('../screens/families/edit/EditLocation')
);
const EditImages = lazy(() => import('../screens/families/edit/EditImages'));
const EditSign = lazy(() => import('../screens/families/edit/EditSign'));
const OrganizationForm = lazy(() =>
  import('../screens/organizations/OrganizationForm')
);
const Projects = lazy(() => import('../screens/Projects'));
const EditEconomicForm = lazy(() =>
  import('../screens/families/edit/EditEconomicForm')
);
const OfflineMaps = lazy(() => import('../screens/OfflineMaps'));

const MyProfile = lazy(() =>
  import('../screens/families/my-profile/MyProfile')
);
const Interventions = lazy(() => import('../screens/Interventions'));
const InterventionForm = lazy(() =>
  import('../screens/interventions/InterventionForm')
);

const Routes = ({ user }) => {
  const history = useHistory();

  const logCurrentPage = () => {
    firebase.analytics().setCurrentScreen(window.location.pathname);
    firebase.analytics().logEvent('screen_view');
  };

  useEffect(() => {
    logCurrentPage(); // log the first page visit
    history.listen(() => {
      logCurrentPage();
    });
  }, [history]);

  return (
    <Suspense
      fallback={
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            height: '100vh',
            alignItems: 'center',
            backgroundColor: '#f3f4f6'
          }}
        >
          <CircularProgress size={50} thickness={2} />
        </div>
      }
    >
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
          {checkAccessToProjects(user) && checkAccess(user, 'projects') && (
            <Route path="/projects" component={Projects} />
          )}
          {checkAccess(user, 'offline-maps') && (
            <Route
              exact
              path="/organizations/:organizationId/offline-maps"
              component={OfflineMaps}
            />
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
          {(checkAccess(user, 'surveys') ||
            checkAccess(user, 'my-profile')) && (
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
          {(checkAccess(user, 'editFamilyImages') ||
            checkAccess(user, 'my-profile')) && (
            <Route
              path="/family/:familyId/edit-images/:snapshotId"
              component={EditImages}
            />
          )}
          {(checkAccess(user, 'editFamilyImages') ||
            checkAccess(user, 'my-profile')) && (
            <Route
              path="/family/:familyId/edit-sign/:snapshotId"
              component={EditSign}
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
          {checkAccess(user, 'priorities') && (
            <Route
              path="/achievements/:familyId"
              component={SelectIndicatorAchievement}
            />
          )}
          {checkAccess(user, 'my-profile') && (
            <Route path="/my-profile" component={MyProfile} />
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
          {checkAccess(user, 'survey-builder') && (
            <Route path="/survey-builder" component={Builder} />
          )}
          {checkAccessToInterventions(user) && (
            <Route exact path="/interventions" component={Interventions} />
          )}
          {checkAccessToInterventions(user) && (
            <Route
              exact
              path="/interventions/create"
              component={InterventionForm}
            />
          )}
          {checkAccessToInterventions(user) && (
            <Route
              path="/interventions/edit/:id"
              component={InterventionForm}
            />
          )}

          {checkAccess(user, 'support') && (
            <Route exact path="/support" component={Support} />
          )}
          {checkAccess(user, 'support') && (
            <Route path="/article/:id" component={ArticleView} />
          )}
          {checkAccess(user, 'support') && (
            <Route path="/articles/create" component={SupportForm} />
          )}

          {checkAccess(user, 'support') && (
            <Route path="/articles/edit/:id" component={SupportForm} />
          )}
          {checkAccess(user, 'support') && (
            <Route path="/collection/:slug" component={CollectionView} />
          )}
          {checkAccess(user, 'libraries') && (
            <Route path="/dimensions" component={DimensionsView} />
          )}

          {!!user.role && <Route render={() => <PageNotFound user={user} />} />}
        </Switch>
      </ErrorBoundary>
    </Suspense>
  );
};

const mapStateToProps = ({ user }) => ({
  user
});

export default connect(mapStateToProps)(Routes);
