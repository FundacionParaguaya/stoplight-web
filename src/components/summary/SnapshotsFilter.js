import React, { useState, useRef } from 'react';
import { Typography, Button, withStyles } from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';

const SnapShotsFilters = ({
  t,
  snapShotNumber,
  snapShotOptions,
  classes,
  onFilterChanged
}) => {
  const [open, setOpen] = useState(false);
  const anchorEl = useRef(null);

  return (
    <div className={classes.mainContainer}>
      <Button
        buttonRef={anchorEl}
        aria-owns={anchorEl ? 'simple-menu' : undefined}
        aria-haspopup="true"
        className={classes.button}
        onClick={() => setOpen(true)}
      >
        <Typography variant="subtitle1" className={classes.buttonText}>
          {snapShotNumber === 0 && `${t('views.snapShotFilter.allSnapShots')}`}
          {snapShotNumber === 1 &&
            `${t('views.snapShotFilter.baseLine')} (N° ${snapShotNumber})`}
          {snapShotNumber > 1 &&
            `${t('views.snapShotFilter.followUp')} (N° ${snapShotNumber})`}
        </Typography>
        <ArrowDropDownIcon className={classes.buttonIcon} />
      </Button>
      <Popper
        open={open}
        anchorEl={anchorEl.current}
        transition
        disablePortal
        className={classes.popper}
      >
        {({ TransitionProps }) => (
          <Grow
            {...TransitionProps}
            id="menu-list-grow"
            style={{
              transitionOrigin: 'center bottom'
            }}
          >
            <Paper
              style={{
                width: anchorEl.current.clientWidth
              }}
              className={classes.paper}
            >
              <ClickAwayListener onClickAway={() => setOpen(false)}>
                <MenuList>
                  {[...Array(snapShotOptions + 1)].map((value, index) => (
                    <MenuItem
                      onClick={() => {
                        setOpen(false);
                        onFilterChanged(index);
                      }}
                      key={index}
                    >
                      <Typography variant="subtitle1">
                        {index === 0 &&
                          `${t('views.snapShotFilter.allSnapShots')}`}
                        {index === 1 &&
                          `${t('views.snapShotFilter.baseLine')} (N° ${index})`}
                        {index > 1 &&
                          `${t('views.snapShotFilter.followUp')} (N° ${index})`}
                      </Typography>
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
};

const styles = () => ({
  mainContainer: {
    width: '100%',
    maxWidth: 300,
    height: '42px',
    border: '1px solid #DCDEE3',
    boxSizing: 'border-box',
    borderRadius: 2,
    backgroundColor: '#FAFBFC',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    height: 'fit-content',
    borderRadius: 0,
    borderTop: 0,
    color: '#6A6A6A',
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: 500,
    width: '100%',
    textDecoration: 'none',
    paddingLeft: 15,
    paddingRight: 15,
    textTransform: 'initial'
  },
  buttonIcon: {
    marginLeft: 'auto'
  },
  buttonText: {
    marginLeft: 'auto',
    fontSize: 14
  },
  paper: {
    border: '0.1px solid #DCDEE3',
    borderRadius: 0,
    backgroundColor: '#FFFFFF'
  },
  popper: {
    zIndex: 100
  }
});

export default withStyles(styles)(withTranslation()(SnapShotsFilters));
