import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import DehazeIcon from '@material-ui/icons/Dehaze';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { ROLE_SURVEY_TAKER } from '../../utils/role-utils';

const useStyles = makeStyles(theme => ({
  button: {
    marginTop: 7,
    marginLeft: 7,
    marginRight: 10,
    backgroundColor: theme.palette.background.default,
    '&:hover': {
      backgroundColor: theme.palette.background.default
    }
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
  menuLink: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 14,
    paddingRight: 14,
    textDecoration: 'none',
    borderBottom: '4px solid transparent'
  }
}));

const HamburgerMenu = ({ tabs, user }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState({});
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (Array.isArray(tabs)) {
      let menuOptions = [];
      const isSurveyor = user.role === ROLE_SURVEY_TAKER;
      !isSurveyor && menuOptions.push({ item: 'dashboard' });
      menuOptions = [...menuOptions, ...tabs];
      setOptions(menuOptions);
    }
  }, [tabs, user]);

  return (
    <React.Fragment>
      <IconButton
        key="dismiss"
        buttonRef={node => {
          setAnchorEl(node);
        }}
        onClick={() => setOpen(!open)}
        className={classes.button}
      >
        <DehazeIcon style={{ color: 'Green' }} />
      </IconButton>
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
                  {options.map(({ item }) => (
                    <MenuItem key={item} className={classes.menuItem}>
                      <NavLink to={`/${item}`} className={classes.menuLink}>
                        <Typography
                          variant="subtitle1"
                          className={classes.menuLinkText}
                        >
                          {t(`views.toolbar.${item}`)}
                        </Typography>
                      </NavLink>
                    </MenuItem>
                  ))}
                  <MenuItem key={'support'} className={classes.menuItem}>
                    <NavLink
                      style={{ textDecoration: 'none' }}
                      to={'/support'}
                      key="support"
                      className={classes.menuLink}
                    >
                      <Typography
                        variant="subtitle1"
                        className={classes.menuLinkText}
                      >
                        {t('views.toolbar.support')}
                      </Typography>
                    </NavLink>
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </React.Fragment>
  );
};

export default HamburgerMenu;
