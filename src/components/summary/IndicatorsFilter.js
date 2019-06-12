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

export const FILTERED_BY_OPTIONS = {
  GREEN: 3,
  YELLOW: 2,
  RED: 1,
  SKIPPED: 0,
  ALL: 'ALL'
};

const IndicatorsFilter = ({
  classes,
  t,
  greenIndicatorCount,
  yellowIndicatorCount,
  redIndicatorCount,
  skippedIndicatorCount,
  filterValue,
  onFilterChanged
}) => {
  const [open, setOpen] = useState(false);
  const anchorEl = useRef(null);
  const allIndicatorsCount =
    greenIndicatorCount +
    yellowIndicatorCount +
    redIndicatorCount +
    skippedIndicatorCount;
  return (
    <div className={classes.mainContainer}>
      <Button
        buttonRef={anchorEl}
        className={classes.button}
        aria-owns={anchorEl ? 'simple-menu' : undefined}
        aria-haspopup="true"
        onClick={() => setOpen(true)}
      >
        <Typography variant="subtitle1" className={classes.buttonText}>
          {filterValue === FILTERED_BY_OPTIONS.ALL &&
            `${t(
              'views.indicatorsFilter.allIndicators'
            )}  (${allIndicatorsCount})`}
          {filterValue === FILTERED_BY_OPTIONS.GREEN &&
            `${t('views.indicatorsFilter.green')} (${greenIndicatorCount})`}
          {filterValue === FILTERED_BY_OPTIONS.YELLOW &&
            `${t('views.indicatorsFilter.yellow')} (${yellowIndicatorCount})`}
          {filterValue === FILTERED_BY_OPTIONS.RED &&
            `${t('views.indicatorsFilter.red')} (${redIndicatorCount})`}
          {filterValue === FILTERED_BY_OPTIONS.SKIPPED &&
            `${t('views.indicatorsFilter.skipped')} (${skippedIndicatorCount})`}
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
                  {filterValue !== FILTERED_BY_OPTIONS.ALL && (
                    <MenuItem
                      onClick={() => {
                        setOpen(false);
                        onFilterChanged(FILTERED_BY_OPTIONS.ALL);
                      }}
                    >
                      <ListItemIcon className={classes.icon}>
                        <div
                          className={classes.indicatorBall}
                          style={{
                            background: `conic-gradient(${COLORS.GREEN} 25%, ${
                              COLORS.YELLOW
                            } 0 50%, ${COLORS.RED} 0 75%, ${
                              COLORS.LIGHT_GREY
                            } 0)`
                          }}
                        />
                      </ListItemIcon>
                      <Typography variant="subtitle1">
                        {`${t(
                          'views.indicatorsFilter.allIndicators'
                        )} (${allIndicatorsCount})`}
                      </Typography>
                    </MenuItem>
                  )}
                  {filterValue !== FILTERED_BY_OPTIONS.GREEN && (
                    <MenuItem
                      onClick={() => {
                        setOpen(false);
                        onFilterChanged(FILTERED_BY_OPTIONS.GREEN);
                      }}
                    >
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
                  )}
                  {filterValue !== FILTERED_BY_OPTIONS.YELLOW && (
                    <MenuItem
                      onClick={() => {
                        setOpen(false);
                        onFilterChanged(FILTERED_BY_OPTIONS.YELLOW);
                      }}
                    >
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
                  )}
                  {filterValue !== FILTERED_BY_OPTIONS.RED && (
                    <MenuItem
                      onClick={() => {
                        setOpen(false);
                        onFilterChanged(FILTERED_BY_OPTIONS.RED);
                      }}
                    >
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
                  )}
                  {filterValue !== FILTERED_BY_OPTIONS.SKIPPED && (
                    <MenuItem
                      onClick={() => {
                        setOpen(false);
                        onFilterChanged(FILTERED_BY_OPTIONS.SKIPPED);
                      }}
                    >
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
                  )}
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
    height: '42px',
    borderBottom: '0.5px solid #DCDEE3',
    borderRadius: 2,
    backgroundColor: '#FAFBFC',
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
    textDecoration: 'none',
    width: 300,
    paddingLeft: 15,
    paddingRight: 15,
    textTransform: 'initial'
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
    marginLeft: 'auto'
  },
  buttonText: {
    marginLeft: 'auto'
  }
});

export default withStyles(styles)(withTranslation()(IndicatorsFilter));
