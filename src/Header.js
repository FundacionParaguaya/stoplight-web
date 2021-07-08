import AppBar from '@material-ui/core/AppBar';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { enviroments, logout } from './api';
import creoleLogo from './assets/creole.png';
import englishLogo from './assets/english.png';
import paragLogo from './assets/paraguay.png';
import portugueseLogo from './assets/portuguese.png';
import DropdownMenu from './components/header/DropdownMenu';
import HamburgerMenu from './components/header/HamburgerMenu';
import Menu from './components/header/Menu';
import i18n from './i18n';
import { updateUser } from './redux/actions';
import { useWindowSize } from './utils/hooks-helpers';
import {
  checkAccessToInterventions,
  checkAccessToProjects,
  checkAccessToSolution,
  NEW,
  ROLES
} from './utils/role-utils';

const useStyles = makeStyles(theme => ({
  header: {
    boxShadow: 'none',
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    borderBottom: `1px solid ${theme.palette.background.paper}`
  },
  toolbar: {
    minHeight: 70,
    padding: 0,
    alignItems: 'stretch'
  },
  menuLinkText: {
    color: theme.palette.text.primary,
    fontWeight: 400,
    position: 'relative',
    top: 4
  },
  extraButtons: {
    marginLeft: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  verticalDivider: {
    height: '100%',
    borderLeft: `1px solid ${theme.palette.background.paper}`
  }
}));

const Header = ({ path, updateUser, user }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const windowSize = useWindowSize();

  const [menuLanguage, setMenuLanguage] = useState();
  const [tabs, setTabs] = useState([]);

  useEffect(() => {
    const language = localStorage.getItem('language') || 'en';
    moment.locale(language);
    setMenuLanguage(language);
  }, []);

  useEffect(() => {
    const currentRole = ROLES[user.role];
    const tabs = currentRole.filter(
      ({ item, platform }) =>
        (platform === NEW &&
          item !== 'projects' &&
          item !== 'solutions' &&
          item !== 'interventions') ||
        (item === 'solutions' && checkAccessToSolution(user)) ||
        (item === 'interventions' && checkAccessToInterventions(user)) ||
        (item === 'projects' && platform === NEW && checkAccessToProjects(user))
    );
    setTabs(tabs);
  }, [user]);

  const handleClose = event => {
    localStorage.setItem('language', event);
    i18n.changeLanguage(event);
    setMenuLanguage(event);
  };

  const handleLogout = () => {
    const env = user.env;
    logout(user).finally(() => {
      updateUser({
        username: null,
        token: null,
        env: null,
        role: null,
        hub: null,
        organization: null,
        name: null
      });
      window.location.replace(`${enviroments[env]}/login`);
    });
  };

  const languageOptions = [
    {
      code: 'en',
      image: englishLogo,
      label: 'English',
      action: () => handleClose('en')
    },
    {
      code: 'es',
      image: paragLogo,
      label: 'Español',
      action: () => handleClose('es')
    },
    {
      code: 'pt',
      image: portugueseLogo,
      label: 'Português',
      action: () => handleClose('pt')
    },
    {
      code: 'ht',
      image: creoleLogo,
      label: 'Creole',
      action: () => handleClose('ht')
    }
  ];

  const logoutOptions = [
    { label: t('views.toolbar.logout'), action: handleLogout }
  ];

  //Min width calc is based on 105px width per tab plus three fixed options
  const showFullNavbar = windowSize.width > (tabs.length + 3) * 105;

  return (
    <AppBar className={classes.header} color="inherit" position="fixed">
      <Toolbar className={classes.toolbar} disableGutters={false}>
        {showFullNavbar ? (
          <Menu tabs={tabs} user={user} />
        ) : (
          <HamburgerMenu path={path} tabs={tabs} user={user} />
        )}
        {/* Extra Buttons */}
        <div className={classes.extraButtons}>
          {showFullNavbar && (
            <NavLink
              style={{ textDecoration: 'none' }}
              to={'/support'}
              key="support"
            >
              <Typography variant="subtitle1" className={classes.menuLinkText}>
                {t('views.toolbar.support')}
              </Typography>
            </NavLink>
          )}
          <DropdownMenu
            placeholder={
              (
                languageOptions.find(o => o.code === menuLanguage) || {
                  label: ''
                }
              ).label
            }
            options={languageOptions}
          />
          <div className={classes.verticalDivider} />
          <DropdownMenu
            placeholder={user.username}
            options={logoutOptions}
            withArrow
          />
        </div>
      </Toolbar>
    </AppBar>
  );
};

const mapStateToProps = ({ user }) => ({ user });
const mapDispatchToProps = { updateUser };

export default connect(mapStateToProps, mapDispatchToProps)(Header);
