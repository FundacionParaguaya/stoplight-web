import React, { useState } from 'react';

import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  button: {
    backgroundColor: theme.palette.background.default,
    textDecoration: 'none',
    '&:hover': {
      backgroundColor: theme.palette.background.default
    },
    [theme.breakpoints.down('340')]: {
      padding: '0 15px'
    }
  },
  menuLinkText: {
    color: theme.palette.text.primary,
    fontWeight: 400,
    position: 'relative',
    top: 4
  },
  rightIcon: {
    marginLeft: theme.spacing(0.5),
    color: theme.palette.text.primary,
    top: 4,
    position: 'relative'
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
  image: {
    width: '20px',
    height: '15px',
    objectFit: 'cover',
    marginRight: '10px'
  }
}));

const DropdownMenu = ({ placeholder, options, withArrow }) => {
  const classes = useStyles();

  const [displayOptions, setDisplayOptions] = useState(false);
  const [anchor, setAnchor] = useState({});

  return (
    <React.Fragment>
      <Button
        variant="contained"
        buttonRef={node => {
          setAnchor(node);
        }}
        aria-owns={displayOptions ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={() => setDisplayOptions(!displayOptions)}
        className={classes.button}
      >
        <Typography variant="subtitle1" className={classes.menuLinkText}>
          {placeholder}
        </Typography>
        {!displayOptions && withArrow && (
          <KeyboardArrowDown className={classes.rightIcon} />
        )}
        {displayOptions && withArrow && (
          <KeyboardArrowUp className={classes.rightIcon} />
        )}
      </Button>
      <Popper
        style={{ zIndex: 10 }}
        open={displayOptions}
        anchorEl={anchor}
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
              <ClickAwayListener onClickAway={() => setDisplayOptions(false)}>
                <MenuList className={classes.menuList}>
                  {options.map(({ image, label, action = () => {} }, index) => (
                    <MenuItem
                      key={index}
                      onClick={() => {
                        setDisplayOptions(false);
                        action();
                      }}
                      className={classes.menuItem}
                    >
                      {!!image && (
                        <img
                          className={classes.image}
                          src={image}
                          alt="optionImage"
                        />
                      )}
                      <Typography variant="subtitle1">{label}</Typography>
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </React.Fragment>
  );
};

DropdownMenu.propTypes = {
  placeholder: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  withArrow: PropTypes.bool
};

DropdownMenu.defaultProps = {
  placeholder: '',
  options: [],
  withArrow: false
};

export default DropdownMenu;
