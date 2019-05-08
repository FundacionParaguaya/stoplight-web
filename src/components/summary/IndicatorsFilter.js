import React, { useState, useRef } from 'react';
import { withStyles } from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { COLORS } from '../../theme';

const IndicatorsFilter = ({
  classes,
  t,
  greenIndicatorCount,
  yellowIndicatorCount,
  redIndicatorCount,
  skippedIndicatorCount
}) => {
  const [open, setOpen] = useState(false);
  const anchorEl = useRef(null);
  return (
    <div className={classes.mainContainer}>
      <Button
        buttonRef={anchorEl}
        className={classes.button}
        aria-owns={anchorEl ? 'simple-menu' : undefined}
        aria-haspopup="true"
        onClick={() => setOpen(true)}
      >
        <Typography variant="subtitle1">
          {t('views.indicatorsFilter.allIndicators')}
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
              transformOrigin: 'center bottom'
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
                  <MenuItem onClick={() => setOpen(false)}>
                    <ListItemIcon className={classes.icon}>
                      <div
                        className={classes.indicatorBall}
                        style={{ backgroundColor: COLORS.GREEN }}
                      />
                    </ListItemIcon>
                    <Typography variant="subtitle1">
                      {`${t(
                        'views.indicatorsFilter.green'
                      )} (${greenIndicatorCount})`}
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={() => setOpen(false)}>
                    <ListItemIcon className={classes.icon}>
                      <div
                        className={classes.indicatorBall}
                        style={{ backgroundColor: COLORS.YELLOW }}
                      />
                    </ListItemIcon>
                    <Typography variant="subtitle1">
                      {`${t(
                        'views.indicatorsFilter.yellow'
                      )} (${yellowIndicatorCount})`}
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={() => setOpen(false)}>
                    <ListItemIcon className={classes.icon}>
                      <div
                        className={classes.indicatorBall}
                        style={{ backgroundColor: COLORS.RED }}
                      />
                    </ListItemIcon>
                    <Typography variant="subtitle1">
                      {`${t(
                        'views.indicatorsFilter.red'
                      )} (${redIndicatorCount})`}
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={() => setOpen(false)}>
                    <ListItemIcon className={classes.icon}>
                      <div
                        className={classes.indicatorBall}
                        style={{ backgroundColor: COLORS.LIGHT_GREY }}
                      />
                    </ListItemIcon>
                    <Typography variant="subtitle1">
                      {`${t(
                        'views.indicatorsFilter.skipped'
                      )} (${skippedIndicatorCount})`}
                    </Typography>
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
};

const styles = theme => ({
  mainContainer: {
    width: '100%',
    height: '42px',
    border: '0.5px solid #DCDEE3',
    borderRadius: 2,
    backgroundColor: '#FAFBFC',
    marginTop: theme.spacing.unit * 4,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    backgroundColor: '#FFFFFF',
    height: '100%',
    border: '0.1px solid #DCDEE3',
    borderRadius: 0,
    borderTop: 0,
    color: '#6A6A6A',
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: 500,
    textDecoration: 'none'
  },
  paper: {
    border: '0.1px solid #DCDEE3',
    borderRadius: 0,
    backgroundColor: '#FFFFFF'
  },
  popper: {
    zIndex: 100
  },
  indicatorBall: {
    borderRadius: '50%',
    width: 17,
    height: 17
  },
  buttonIcon: {
    marginLeft: theme.spacing.unit * 2
  }
});

export default withStyles(styles)(withTranslation()(IndicatorsFilter));
