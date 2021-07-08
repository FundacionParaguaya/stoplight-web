import Chip from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useHistory } from 'react-router-dom';
import logo from '../../assets/header_logo.png';
import DropdownMenu from './DropdownMenu';
import {
  checkAccess,
  getHomePage,
  roleHasMoreThanOneAccess
} from '../../utils/role-utils';

const useStyles = makeStyles(theme => ({
  container: {
    position: 'relative',
    display: 'flex'
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
    borderBottom: '4px solid transparent',
    '& button': {
      padding: 0
    }
  },
  surveyLink: {
    borderBottom: `4px solid ${theme.palette.primary.main}`
  },
  chip: {
    backgroundColor: '#ff9800',
    color: theme.palette.background.default,
    fontSize: 10,
    margin: '3px 0',
    height: 18,
    position: 'absolute',
    right: -20,
    bottom: 2
  }
}));

const Menu = ({ path, tabs, user }) => {
  const classes = useStyles();
  const history = useHistory();
  const { t } = useTranslation();

  return (
    <React.Fragment>
      {/* Logo */}
      <NavLink
        to={`/${
          checkAccess(user, 'dashboard') ? `dashboard` : getHomePage(user.role)
        }`}
        className={clsx(
          classes.menuLink,
          path === `/dashboard` && classes.surveyLink
        )}
        style={{
          cursor: roleHasMoreThanOneAccess(user.role) ? 'pointer' : 'default'
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
      {tabs.map(({ item, version, options }) => (
        <div key={item} className={classes.container}>
          {!Array.isArray(options) ? (
            <NavLink
              to={`/${item}`}
              className={clsx(
                classes.menuLink,
                path === `/${item}` && classes.surveyLink
              )}
            >
              <Typography variant="subtitle1" className={classes.menuLinkText}>
                {t(`views.toolbar.${item}`)}
              </Typography>
            </NavLink>
          ) : (
            <div
              className={clsx(
                classes.menuLink,
                path === `/${item}` && classes.surveyLink
              )}
            >
              <DropdownMenu
                placeholder={t(`views.toolbar.${item}`)}
                options={options.map(option => ({
                  label: t(`views.toolbar.${option}`),
                  action: () => history.push(`/${option}`)
                }))}
                withArrow
              />
            </div>
          )}
          {version === 'BETA' && (
            <Chip classes={{ root: classes.chip }} label="Beta" />
          )}
        </div>
      ))}
    </React.Fragment>
  );
};

export default Menu;
