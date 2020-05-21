import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Link } from 'react-router-dom';
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
import Typography from '@material-ui/core/Typography';
import interrogation from '../assets/interrogation.png';
import { useTranslation } from 'react-i18next';
import { ROLES_NAMES } from '../utils/role-utils';

const Routes = ({ user }) => {
  const pageNotFoundStyles = makeStyles(theme => ({
    container: {
      display: 'flex',
      height: '100vh',
      alignItems: 'center',
      justifyContent: 'center'
    },
    imageContainer: {
      display: 'flex',
      width: '50%'
    },
    img: {
      maxWidth: '80%',
      maxHeight: 800,
      margin: 'auto'
    },
    textContainer: {
      width: '50%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'left',
      padding: 20
    },
    text: {
      color: theme.palette.grey.middle
    },
    codeText: {
      fontSize: 120,
      fontWeight: 600,
      color: theme.palette.grey.main,
      height: 90
    },
    linkText: {
      fontWeight: 600,
      position: 'relative',
      marginTop: 20,
      textDecoration: 'none',
      fontSize: 16,
      color: theme.palette.primary.dark
    }
  }));

  const { t } = useTranslation();

  const classes = pageNotFoundStyles();

  const redirectionPath = ({ role }) => {
    if (role === ROLES_NAMES.ROLE_SURVEY_TAKER) {
      return 'surveys';
    } else return 'dashboard';
  };

  let PageNotFound = ({ user }) => (
    <div className={classes.container}>
      <div className={classes.imageContainer}>
        <img src={interrogation} alt="interrogation" className={classes.img} />
      </div>
      <div className={classes.textContainer}>
        <Typography variant="h4" className={classes.codeText}>
          {'404'}
        </Typography>
        <Typography variant="h5" className={classes.text}>
          {t('views.404.missing')}
        </Typography>
        <Typography variant="h6" className={classes.text}>
          {t('views.404.pageNotFound')}
        </Typography>
        <Link to={redirectionPath(user)} className={classes.linkText}>
          {`${t('views.404.toHomePage')} >`}
        </Link>
      </div>
    </div>
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
      <Route render={() => <PageNotFound user={user} />} />
    </Switch>
  );
};

const mapStateToProps = ({ user }) => ({
  user
});

export default connect(mapStateToProps)(Routes);
