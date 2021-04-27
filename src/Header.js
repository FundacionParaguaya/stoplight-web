import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { enviroments, logout } from './api';
import englishLogo from './assets/english.png';
import creoleLogo from './assets/creole.png';
import logo from './assets/header_logo.png';
import paragLogo from './assets/paraguay.png';
import portugueseLogo from './assets/portuguese.png';
import DropdownMenu from './components/DropdownMenu';
import i18n from './i18n';
import { updateUser } from './redux/actions';
import { useWindowSize } from './utils/hooks-helpers';
import { ROLES_NAMES } from './utils/role-utils';
import {
  checkAccessToProjects,
  checkAccessToSolution,
  NEW,
  ROLES,
  checkAccess,
  getHomePage
} from './utils/role-utils';

const useStyles = makeStyles(theme => ({
  header: {
    boxShadow: 'none',
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    borderBottom: `1px solid ${theme.palette.background.paper}`
  },
  imgLogo: {
    width: '20px',
    height: '15px',
    objectFit: 'cover',
    marginRight: '10px'
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
  menuLink: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 14,
    paddingRight: 14,
    textDecoration: 'none',
    borderBottom: '4px solid transparent'
  },
  menuLinkSolutions: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 14,
    paddingRight: 14,
    textDecoration: 'none',
    borderBottom: '4px solid transparent'
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
  },
  rightIcon: {
    marginLeft: theme.spacing(0.5),
    color: theme.palette.text.primary,
    top: 4,
    position: 'relative'
  },
  surveyLink: {
    borderBottom: `4px solid ${theme.palette.primary.main}`
  },
  menuList: {
    backgroundColor: theme.palette.background.default,
    border: `1px solid ${theme.palette.background.paper}`
  },
  menuItem: {
    '&:hover': {
      backgroundColor: theme.palette.background.paper
    }
  },
  chip: {
    backgroundColor: '#ff9800',
    color: theme.palette.background.default,
    fontSize: 10,
    marginTop: '3px',
    marginBottom: '3px',
    height: '18px',
    [theme.breakpoints.up('md')]: {
      alignSelf: 'flex-end'
    },
    [theme.breakpoints.down('md')]: {}
  },
  extraButton: {
    backgroundColor: theme.palette.background.default,
    textDecoration: 'none',
    '&:hover': {
      backgroundColor: theme.palette.background.default
    },
    [theme.breakpoints.down('340')]: {
      padding: '0 15px'
    }
  }
}));

const Header = ({ path, updateUser, user }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const windowSize = useWindowSize();

  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState({});
  const [openUserOptions, setOpenUserOptions] = useState(false);
  const [anchorUserOptionsEl, setAnchorUserOptionsEl] = useState({});
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
        (platform === NEW && item !== 'projects' && item !== 'solutions') ||
        (item === 'solutions' && checkAccessToSolution(user)) ||
        (item === 'projects' && platform === NEW && checkAccessToProjects(user))
    );
    setTabs(tabs);
  }, [user]);

  const handleClose = event => {
    localStorage.setItem('language', event);
    i18n.changeLanguage(event);
    setOpen(false);
    setMenuLanguage(event);
  };

  const handleLogout = () => {
    const env = user.env;
    setOpenUserOptions(false);
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

  //Min width calc is based on 105px width per tab plus three fixed options
  const showFullNavbar = windowSize.width > (tabs.length + 3) * 105;

  return (
    <AppBar className={classes.header} color="inherit" position="fixed">
      <Toolbar className={classes.toolbar} disableGutters={false}>
        {showFullNavbar ? (
          <React.Fragment>
            {/* Logo to dashboard */}
            <NavLink
              to={`/${
                checkAccess(user, 'dashboard')
                  ? `dashboard`
                  : getHomePage(user.role)
              }`}
              className={
                path === `/dashboard`
                  ? `${classes.menuLink} ${classes.surveyLink}`
                  : classes.menuLink
              }
              style={{
                cursor:
                  user.role === ROLES_NAMES.ROLE_FAMILY_USER
                    ? 'default'
                    : 'pointer'
              }}
              key="dashboard"
            >
              <img
                style={{ marginTop: 4 }}
                src={logo}
                alt="Stoplight Logo"
                width={38}
                height={38}
              />
            </NavLink>

            {/* Rest of the items */}
            {tabs.map(({ item, version }) => (
              <NavLink
                to={`/${item}`}
                className={
                  path === `/${item}`
                    ? `${classes.menuLinkSolutions} ${classes.surveyLink}`
                    : classes.menuLinkSolutions
                }
                key={item}
              >
                <Typography
                  variant="subtitle1"
                  className={classes.menuLinkText}
                >
                  {t(`views.toolbar.${item}`)}
                </Typography>
                {version === 'BETA' && (
                  <Chip classes={{ root: classes.chip }} label="Beta" />
                )}
              </NavLink>
            ))}
          </React.Fragment>
        ) : (
          <DropdownMenu tabs={tabs} user={user} />
        )}
        {/* Extra Buttons */}
        <div className={classes.extraButtons}>
          {showFullNavbar && (
            <a
              style={{ color: 'white' }}
              href="https://intercom.help/poverty-stoplight"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Typography variant="subtitle1" className={classes.menuLinkText}>
                {t('views.toolbar.support')}
              </Typography>
            </a>
          )}
          <Button
            buttonRef={node => {
              setAnchorEl(node);
            }}
            aria-owns={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            onClick={() => setOpen(!open)}
            className={classes.extraButton}
          >
            <Typography variant="subtitle1" className={classes.menuLinkText}>
              {menuLanguage === 'en' && 'English'}
              {menuLanguage === 'es' && 'Español'}
              {menuLanguage === 'pt' && 'Português'}
              {menuLanguage === 'ht' && 'Creole'}
            </Typography>
          </Button>
          <div className={classes.verticalDivider} />
          <Button
            variant="contained"
            buttonRef={node => {
              setAnchorUserOptionsEl(node);
            }}
            aria-owns={openUserOptions ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            onClick={() => setOpenUserOptions(!openUserOptions)}
            className={classes.extraButton}
          >
            <Typography variant="subtitle1" className={classes.menuLinkText}>
              {user.username}
            </Typography>
            {!openUserOptions && (
              <KeyboardArrowDown className={classes.rightIcon} />
            )}
            {openUserOptions && (
              <KeyboardArrowUp className={classes.rightIcon} />
            )}
          </Button>
        </div>
        <Popper open={open} anchorEl={anchorEl} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              id="menu-list-grow"
              style={{
                transformOrigin:
                  placement === 'bottom' ? 'center top' : 'center bottom'
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={() => setOpen(false)}>
                  <MenuList className={classes.menuList}>
                    <MenuItem
                      onClick={() => handleClose('en')}
                      className={classes.menuItem}
                    >
                      <img
                        className={classes.imgLogo}
                        src={englishLogo}
                        alt="eng"
                      />
                      English
                    </MenuItem>
                    <MenuItem
                      className={classes.menuItem}
                      onClick={() => handleClose('es')}
                    >
                      <img
                        className={classes.imgLogo}
                        src={paragLogo}
                        alt="eng"
                      />
                      Español
                    </MenuItem>
                    <MenuItem
                      className={classes.menuItem}
                      onClick={() => handleClose('pt')}
                    >
                      <img
                        className={classes.imgLogo}
                        src={portugueseLogo}
                        alt="eng"
                      />
                      Português
                    </MenuItem>
                    <MenuItem
                      className={classes.menuItem}
                      onClick={() => handleClose('ht')}
                    >
                      <img
                        className={classes.imgLogo}
                        src={creoleLogo}
                        alt="eng"
                      />
                      Creole
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
        <Popper
          open={openUserOptions}
          anchorEl={anchorUserOptionsEl}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              id="menu-list-grow"
              style={{
                transformOrigin:
                  placement === 'bottom' ? 'center top' : 'center bottom'
              }}
            >
              <Paper>
                <ClickAwayListener
                  onClickAway={() => setOpenUserOptions(false)}
                >
                  <MenuList className={classes.menuList}>
                    <MenuItem
                      onClick={() => handleLogout()}
                      className={classes.menuItem}
                    >
                      <Typography variant="subtitle1">
                        {t('views.toolbar.logout')}
                      </Typography>
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Toolbar>
    </AppBar>
  );
};

const mapStateToProps = ({ user }) => ({ user });
const mapDispatchToProps = { updateUser };

export default connect(mapStateToProps, mapDispatchToProps)(Header);
