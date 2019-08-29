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
import { COLORS } from '../theme';

export const FILTERED_BY_OPTIONS = {
  GREEN: 3,
  YELLOW: 2,
  RED: 1,
  SKIPPED: 0,
  ALL: 'ALL'
};

export const SORT_BY_OPTIONS = {
  DEFAULT: 'DEFAULT',
  MOST_GREENS: 'MOST_GREENS',
  MOST_REDS: 'MOST_REDS',
  MOST_YELLOWS: 'MOST_YELLOWS',
  MOST_SKIPPED: 'MOST_SKIPPED',
  MOST_PRIORITIZED: 'MOST_PRIORITIZED',
  LESS_PRIORITIZED: 'LESS_PRIORITIZED',
  MOST_ACHIEVED: 'MOST_ACHIEVED',
  LESS_ACHIEVED: 'LESS_ACHIEVED'
};

export const sorter = sortBy => (indA, indB) => {
  let compareResult = 0;
  const stoplightCountFinder = (stoplights, filter, total) => {
    const stoplight = stoplights.find(s => s.color === filter) || { count: 0 };
    return stoplight.count / total;
  };
  const { stoplights: stoplightsA = [] } = indA;
  const { stoplights: stoplightsB = [] } = indB;
  const { priorities: prioritiesA = 0 } = indA;
  const { priorities: prioritiesB = 0 } = indB;
  const { achievements: achievementsA = 0 } = indA;
  const { achievements: achievementsB = 0 } = indB;
  const totalA = stoplightsA.reduce((acc, current) => acc + current.count, 0);
  const totalB = stoplightsB.reduce((acc, current) => acc + current.count, 0);
  if (sortBy === SORT_BY_OPTIONS.MOST_GREENS) {
    compareResult =
      stoplightCountFinder(stoplightsB, 3, totalB) -
      stoplightCountFinder(stoplightsA, 3, totalA);
  } else if (sortBy === SORT_BY_OPTIONS.MOST_YELLOWS) {
    compareResult =
      stoplightCountFinder(stoplightsB, 2, totalB) -
      stoplightCountFinder(stoplightsA, 2, totalA);
  } else if (sortBy === SORT_BY_OPTIONS.MOST_REDS) {
    compareResult =
      stoplightCountFinder(stoplightsB, 1, totalB) -
      stoplightCountFinder(stoplightsA, 1, totalA);
  } else if (sortBy === SORT_BY_OPTIONS.MOST_SKIPPED) {
    compareResult =
      stoplightCountFinder(stoplightsB, 0, totalB) -
      stoplightCountFinder(stoplightsA, 0, totalA);
  } else if (sortBy === SORT_BY_OPTIONS.MOST_PRIORITIZED) {
    compareResult = prioritiesB - prioritiesA;
  } else if (sortBy === SORT_BY_OPTIONS.LESS_PRIORITIZED) {
    compareResult = prioritiesA - prioritiesB;
  } else if (sortBy === SORT_BY_OPTIONS.MOST_ACHIEVED) {
    compareResult = achievementsB - achievementsA;
  } else if (sortBy === SORT_BY_OPTIONS.LESS_ACHIEVED) {
    compareResult = achievementsA - achievementsB;
  } else if (sortBy === SORT_BY_OPTIONS.DEFAULT) {
    compareResult = 0;
  }
  return compareResult;
};

const IndicatorsFilter = ({
  classes,
  t,
  greenIndicatorCount,
  yellowIndicatorCount,
  redIndicatorCount,
  skippedIndicatorCount,
  filterValue,
  onFilterChanged,
  sorting,
  sortingBy,
  onSortingChanged
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
          {!sorting &&
            filterValue === FILTERED_BY_OPTIONS.ALL &&
            `${t(
              'views.indicatorsFilter.allIndicators'
            )}  (${allIndicatorsCount})`}
          {!sorting &&
            filterValue === FILTERED_BY_OPTIONS.GREEN &&
            `${t('views.indicatorsFilter.green')} (${greenIndicatorCount})`}
          {!sorting &&
            filterValue === FILTERED_BY_OPTIONS.YELLOW &&
            `${t('views.indicatorsFilter.yellow')} (${yellowIndicatorCount})`}
          {!sorting &&
            filterValue === FILTERED_BY_OPTIONS.RED &&
            `${t('views.indicatorsFilter.red')} (${redIndicatorCount})`}
          {!sorting &&
            filterValue === FILTERED_BY_OPTIONS.SKIPPED &&
            `${t('views.indicatorsFilter.skipped')} (${skippedIndicatorCount})`}
          {sorting && t(`views.indicatorsFilter.sort.${sortingBy}`)}
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
                  {!sorting && filterValue !== FILTERED_BY_OPTIONS.ALL && (
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
                  {!sorting && filterValue !== FILTERED_BY_OPTIONS.GREEN && (
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
                  {!sorting && filterValue !== FILTERED_BY_OPTIONS.YELLOW && (
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
                  {!sorting && filterValue !== FILTERED_BY_OPTIONS.RED && (
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
                  {!sorting && filterValue !== FILTERED_BY_OPTIONS.SKIPPED && (
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
                  {sorting &&
                    Object.keys(SORT_BY_OPTIONS)
                      .filter(key => sortingBy !== key)
                      .map(key => (
                        <MenuItem
                          className={classes.sortItemStyle}
                          key={key}
                          onClick={() => {
                            setOpen(false);
                            onSortingChanged(key);
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            className={classes.itemTextStyle}
                          >
                            {t(`views.indicatorsFilter.sort.${key}`)}
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
    height: '100%',
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
    marginLeft: 'auto',
    fontSize: 14
  },
  itemTextStyle: {
    fontSize: 14
  },
  sortItemStyle: {
    minHeight: '42px'
  }
});

export default withStyles(styles)(withTranslation()(IndicatorsFilter));
