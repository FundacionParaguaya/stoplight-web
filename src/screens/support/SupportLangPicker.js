import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import React, { useState } from 'react';
import englishLogo from '../../assets/english.png';
import paragLogo from '../../assets/paraguay.png';

const useStyles = makeStyles(theme => ({
  menuList: {
    backgroundColor: theme.palette.background.default,
    border: `1px solid ${theme.palette.background.paper}`
  },
  menuItem: {
    '&:hover': {
      backgroundColor: theme.palette.background.paper
    }
  },
  imgLogo: {
    width: '20px',
    height: '20px',
    objectFit: 'cover',
    marginRight: '10px'
  },
  menuLinkTextLigth: {
    fontWeight: 500,
    position: 'relative',
    color: theme.palette.background.default
  },
  menuLinkText: {
    fontWeight: 500,
    position: 'relative',
    color: theme.palette.text.light
  },
  tooltip: {
    zIndex: 14
  },
  rightIconLigth: {
    marginLeft: theme.spacing(0.5),
    color: theme.palette.background.default,
    position: 'relative'
  },
  rightIcon: {
    marginLeft: theme.spacing(0.5),
    position: 'relative',
    color: theme.palette.text.light
  }
}));

const SupportLangPicker = ({ setLanguage, language, primaryStyle }) => {
  const classes = useStyles();

  const [open, setOpen] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClose = event => {
    setLanguage(event);
    setOpen(!open);
    setLanguage(event);
  };

  const handleClick = event => {
    setOpen(!open);
    setAnchorEl(event.currentTarget);
  };

  let logo;
  switch (language) {
    case 'en':
      logo = englishLogo;
      break;
    case 'es':
      logo = paragLogo;
      break;
    default:
  }

  return (
    <React.Fragment>
      <Button
        style={{
          color: 'white',
          alignItems: 'center',
          display: 'flex',
          marginBottom: '4px',
          paddingRight: 8
        }}
        aria-owns={open ? 'menu-list-grow' : null}
        aria-haspopup="true"
        onClick={event => handleClick(event)}
      >
        <img className={classes.imgLogo} src={logo} alt="flag" />
        <Typography
          variant="subtitle1"
          align="center"
          className={
            primaryStyle ? classes.menuLinkText : classes.menuLinkTextLigth
          }
        >
          {language === 'en' && 'English'}
          {language === 'es' && 'Español'}
        </Typography>
        <KeyboardArrowDown
          className={primaryStyle ? classes.rightIcon : classes.rightIconLigth}
        />
      </Button>
      <Popper
        className={classes.tooltip}
        open={open}
        anchorEl={anchorEl}
        transition
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
              <ClickAwayListener onClickAway={() => setOpen(!open)}>
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
                    <img className={classes.imgLogo} src={paragLogo} alt="es" />
                    Español
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

export default SupportLangPicker;
