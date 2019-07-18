import React from 'react';
import { withStyles, Typography, Grid } from '@material-ui/core';
import { useTransition, animated } from 'react-spring';
import { withTranslation } from 'react-i18next';
import SummaryStackedBar from './summary/SummaryStackedBar';
import PieGrid from './PieGrid';
import withControllers from './withControllers';
import { PIE, BAR } from '../utils/types';

const parseStoplights = stoplights => {
  const getByColor = i =>
    stoplights.find(s => s.color === i)
      ? stoplights.find(s => s.color === i).count
      : 0;

  const green = getByColor(3);
  const yellow = getByColor(2);
  const red = getByColor(1);
  const skipped = getByColor(0);

  return [green, yellow, red, skipped];
};

/**
 * @param {bool} label Render a label below the icon and count
 * @param {string} countVariant Change the Typography variant of the count title
 */

const indicatorsStyles = theme => ({
  barContainer: {
    padding: `${theme.spacing()}px ${theme.spacing(3)}px`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    '&:nth-child(2n)': {
      backgroundColor: theme.palette.grey.light
    }
  },
  title: {
    marginTop: 5,
    marginBottom: 5
  },
  titleContainer: {
    width: '25%',
    paddingRight: theme.spacing()
  },
  pieContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  pieInnerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    width: 150,
    textAlign: 'center',
    position: 'relative'
  },
  flexStart: {
    alignItems: 'flex-start'
  },
  flexEnd: {
    alignItems: 'flex-end'
  },
  detailContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    position: 'absolute',
    top: 15,
    right: 0,
    zIndex: 1
  },
  stackedBarContainer: {
    width: '75%'
  }
});

const Indicators = withStyles(indicatorsStyles)(
  ({ classes, type, data, fadeIn }) => {
    const transitions = useTransition(type, null, {
      config: { tension: 350, mass: 1, friction: 50 },
      from: { opacity: fadeIn ? 0 : 1 },
      enter: { opacity: 1 },
      leave: { opacity: fadeIn ? 0 : 1 }
    });

    return transitions.map(({ item, key, props }) => {
      return (
        <div key={key} style={{ position: 'relative' }}>
          {item === PIE && (
            <animated.div
              style={{ ...props, position: type === BAR ? 'absolute' : null }}
            >
              <PieGrid items={data} />
            </animated.div>
          )}
          {item === BAR && (
            <animated.div
              style={{ ...props, position: type === PIE ? 'absolute' : null }}
            >
              <Grid container>
                {data.map(indicator => {
                  const [green, yellow, red, skipped] = parseStoplights(
                    indicator.stoplights
                  );
                  return (
                    <Grid
                      item
                      xs={12}
                      key={indicator.name}
                      className={classes.barContainer}
                    >
                      <div className={classes.titleContainer}>
                        <Typography
                          variant="subtitle2"
                          className={classes.title}
                        >
                          {indicator.name}
                        </Typography>
                      </div>

                      <div className={classes.stackedBarContainer}>
                        <SummaryStackedBar
                          greenIndicatorCount={green}
                          yellowIndicatorCount={yellow}
                          redIndicatorCount={red}
                          skippedIndicatorCount={skipped}
                        />
                      </div>
                    </Grid>
                  );
                })}
              </Grid>
            </animated.div>
          )}
        </div>
      );
    });
  }
);

const IndicatorsVisualisation = withControllers('views.indicators', true)(
  Indicators
);

export default withTranslation()(IndicatorsVisualisation);
