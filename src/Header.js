import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import { withTranslation } from 'react-i18next';
import logo from './assets/header_logo.png';
import i18n from './i18n';
import englishLogo from './assets/english.png';
import paragLogo from './assets/paraguay.png';
import { ROLES, getPlatform, OLD } from './utils/role-based-header';
import { logout } from './api';

class Header extends Component {
  state = {
    open: false,
    openUserOptions: false,
    langaugeMenuMain: 'en'
  };

  componentDidMount() {
    const lng = localStorage.getItem('language');
    this.setState({ langaugeMenuMain: lng });
  }

  componentDidUpdate() {
    const lng = localStorage.getItem('language');
    if (this.state.langaugeMenuMain !== lng) {
      this.setState({ langaugeMenuMain: lng });
    }
  }

  handleToggle = () => {
    this.setState(state => ({ open: !state.open }));
  };

  handleCloseAway = () => {
    this.setState({ open: false });
  };

  handleClose = event => {
    localStorage.setItem('language', event);
    i18n.changeLanguage(event);
    this.setState({ open: false, langaugeMenuMain: event });
  };

  handleToggleUserOptions = () => {
    this.setState(state => ({ openUserOptions: !state.openUserOptions }));
  };

  handleCloseAwayUserOptions = () => {
    this.setState({ openUserOptions: false });
  };

  handleLogout = () => {
    this.setState({ openUserOptions: false });
    logout(this.props.user).finally(() => {
      window.location.replace(
        `https://${this.props.user.env}.povertystoplight.org/login.html`
      );
    });
  };

  render() {
    const { classes, user, t, path } = this.props;

    return (
      <AppBar className={classes.header} color="inherit" position="fixed">
        <Toolbar className={classes.toolbar} disableGutters={false}>
          <span
            // If we need to reimplement href, change </span> to </a>
            // href={`https://${user.env}.povertystoplight.org`}
            className={classes.menuLink}
            style={{ position: 'relative' }}
          >
            <img
              style={{ marginTop: 4 }}
              src={logo}
              alt="Stoplight Logo"
              width={38}
              height={38}
            />
          </span>
          {ROLES[user.role].map(({ item, platform }) => {
            if (platform === OLD) {
              return (
                <a
                  key={item}
                  href={`${getPlatform(user.env)}/#${item}`}
                  className={classes.menuLink}
                >
                  <Typography
                    variant="subtitle1"
                    className={classes.menuLinkText}
                  >
                    {t(`views.toolbar.${item}`)}
                  </Typography>
                </a>
              );
            }

            return (
              <NavLink
                to={`/${item}?sid=${this.props.user.token}&lang=en`}
                className={
                  path === `/${item}`
                    ? `${classes.menuLink} ${classes.surveyLink}`
                    : classes.menuLink
                }
                key={item}
              >
                <Typography
                  variant="subtitle1"
                  className={classes.menuLinkText}
                >
                  {t(`views.toolbar.${item}`)}
                </Typography>
              </NavLink>
            );
          })}
          <div className={classes.extraButtons}>
            <Button
              style={{ color: 'white' }}
              buttonRef={node => {
                this.anchorEl = node;
              }}
              aria-owns={this.state.open ? 'menu-list-grow' : undefined}
              aria-haspopup="true"
              onClick={this.handleToggle}
            >
              <Typography variant="subtitle1" className={classes.menuLinkText}>
                {this.state.langaugeMenuMain === 'en' ? 'ENG' : 'ESP'}
              </Typography>
            </Button>
            <div className={classes.verticalDivider} />
            <Button
              style={{ backgroundColor: 'white' }}
              variant="contained"
              buttonRef={node => {
                this.anchorUserOptionsEl = node;
              }}
              aria-owns={
                this.state.openUserOptions ? 'menu-list-grow' : undefined
              }
              aria-haspopup="true"
              onClick={this.handleToggleUserOptions}
            >
              <Typography variant="subtitle1" className={classes.menuLinkText}>
                {this.props.user.username}
              </Typography>
              {!this.state.openUserOptions && (
                <KeyboardArrowDown className={classes.rightIcon} />
              )}
              {this.state.openUserOptions && (
                <KeyboardArrowUp className={classes.rightIcon} />
              )}
            </Button>
          </div>
          <Popper
            open={this.state.open}
            anchorEl={this.anchorEl}
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
                  <ClickAwayListener onClickAway={this.handleCloseAway}>
                    <MenuList className={classes.menuList}>
                      <MenuItem
                        onClick={() => this.handleClose('en')}
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
                        onClick={() => this.handleClose('es')}
                      >
                        <img
                          className={classes.imgLogo}
                          src={paragLogo}
                          alt="eng"
                        />
                        Español
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
          <Popper
            open={this.state.openUserOptions}
            anchorEl={this.anchorUserOptionsEl}
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
                    onClickAway={this.handleCloseAwayUserOptions}
                  >
                    <MenuList className={classes.menuList}>
                      <MenuItem
                        onClick={() => this.handleLogout()}
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
  }
}

const styles = theme => ({
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
    color: '#1C212F',
    fontWeight: 400,
    textTransform: 'capitalize',
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
    color: '#1C212F',
    top: 4,
    position: 'relative'
  },
  surveyLink: {
    borderBottom: `4px solid ${theme.palette.primary.main}`
  },
  menuList: {
    backgroundColor: '#fff',
    border: `1px solid ${theme.palette.background.paper}`
  },
  menuItem: {
    '&:hover': {
      backgroundColor: theme.palette.background.paper
    }
  }
});

const mapStateToProps = ({ user }) => ({ user });

export default withStyles(styles)(
  connect(
    mapStateToProps,
    {}
  )(withTranslation()(Header))
);
