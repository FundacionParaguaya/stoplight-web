import React, { useEffect, useState } from 'react';
import i18n from '../i18n';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import englishLogo from '../assets/english.png';
import paragLogo from '../assets/paraguay.png';
import portugueseLogo from '../assets/portuguese.png';

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
    height: '15px',
    objectFit: 'cover',
    marginRight: '10px'
  },
  menuLinkText: {
    color: theme.palette.text.primary,
    fontWeight: 400,
    position: 'relative',
    top: 4
  }
}));

const normalizeLanguages = lang => {
  const shortLang = lang.substr(0, 2);
  const languages = {
    en: 'en',
    es: 'es',
    pt: 'pt'
  };
  return languages[shortLang] || languages['en'];
};

const LanguageSelector = () => {
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState(
    localStorage.getItem('language') || 'en'
  );
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const language = normalizeLanguages(window.navigator.language);
    localStorage.setItem('language', language);
    setLanguage(language);
  }, []);

  const handleClose = event => {
    setLanguage(event);
    setOpen(!open);
    localStorage.setItem('language', event);
    i18n.changeLanguage(event);
  };

  const handleClick = event => {
    setOpen(!open);
    setAnchorEl(event.currentTarget);
  };

  return (
    <React.Fragment>
      <Button
        style={{ color: 'white' }}
        aria-owns={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={event => handleClick(event)}
      >
        <Typography variant="subtitle1" className={classes.menuLinkText}>
          {language === 'en' && 'English'}
          {language === 'es' && 'Español'}
          {language === 'pt' && 'Português'}
        </Typography>
      </Button>
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
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </React.Fragment>
  );
};

export default LanguageSelector;
