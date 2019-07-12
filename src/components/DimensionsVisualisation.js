import React, { useState, useCallback } from 'react';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { Typography, withStyles, Box } from '@material-ui/core';
import {
  normalizeDimension,
  NORMALIZED_DIMENSIONS
} from '../utils/parametric_data';
import dimensionEducationIcon from '../assets/dimension_education.png';
import dimensionHealthIcon from '../assets/dimension_health.png';
import dimensionHousingIcon from '../assets/dimension_housing.png';
import dimensionIncomeIcon from '../assets/dimension_income.png';
import dimensionInteriorityIcon from '../assets/dimension_interiority.png';
import dimensionOrganizationIcon from '../assets/dimension_organization.png';
import SummaryStackedBar from './summary/SummaryStackedBar';
import CountDetail from './CountDetail';
import { COLORS } from '../theme';
import withControllers from './withControllers';
import PieGrid from './PieGrid';
import { PIE, BAR } from '../utils/types';

const getIndCountByColor = (data = [], color) => {
  let count = 0;
  const ind = data.find(d => d.color === color);
  if (ind) {
    count = ind.count || 0;
  }
  return count;
};

const getIconForDimension = dimension => {
  switch (normalizeDimension(dimension)) {
    case NORMALIZED_DIMENSIONS.EDUCATION:
      return dimensionEducationIcon;
    case NORMALIZED_DIMENSIONS.HEALTH:
      return dimensionHealthIcon;
    case NORMALIZED_DIMENSIONS.HOUSING:
      return dimensionHousingIcon;
    case NORMALIZED_DIMENSIONS.INCOME:
      return dimensionIncomeIcon;
    case NORMALIZED_DIMENSIONS.INTERIORITY:
      return dimensionInteriorityIcon;
    case NORMALIZED_DIMENSIONS.ORGANIZATION:
      return dimensionOrganizationIcon;
    default:
      return null;
  }
};

let DimensionTitle = ({ classes, dimension, excludeIcon }) => (
  <div className={classes.mainContainer}>
    {excludeIcon && <div className={classes.spacer} />}
    {!excludeIcon && (
      <div className={classes.iconContainer}>
        <img
          src={getIconForDimension(dimension)}
          className={classes.icon}
          alt=""
        />
      </div>
    )}
    <Typography
      className={classes.title}
      style={{
        color: excludeIcon ? COLORS.TEXT_GREY : null,
        padding: excludeIcon ? '4px 0' : null
      }}
      variant="subtitle2"
    >
      {dimension}
    </Typography>
  </div>
);
DimensionTitle.defaultProps = {
  excludeIcon: false
};

const dimensionTitleStyle = () => ({
  mainContainer: {
    flexBasis: '25%',
    width: '25%',
    display: 'flex',
    alignItems: 'center'
  },
  title: {
    display: 'flex'
  },
  icon: {
    width: '41px',
    paddingRight: '16px'
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  spacer: {
    paddingRight: '41px'
  }
});
DimensionTitle = withStyles(dimensionTitleStyle)(DimensionTitle);

let DimensionIndicator = ({ classes, dimension: { indicators } }) => (
  <React.Fragment>
    {indicators.map(indicator => {
      return (
        <ListItem key={indicator.name} classes={{ root: classes.listItem }}>
          <div className={classes.mainItemContainer}>
            <DimensionTitle dimension={indicator.name} excludeIcon />
            <div className={classes.stackbarContainer}>
              <SummaryStackedBar
                greenIndicatorCount={getIndCountByColor(
                  indicator.stoplights,
                  3
                )}
                yellowIndicatorCount={getIndCountByColor(
                  indicator.stoplights,
                  2
                )}
                redIndicatorCount={getIndCountByColor(indicator.stoplights, 1)}
                skippedIndicatorCount={getIndCountByColor(
                  indicator.stoplights,
                  0
                )}
              />
            </div>
            <div className={classes.rightSpaceFiller} />
          </div>
        </ListItem>
      );
    })}
  </React.Fragment>
);

const dimensionIndicatorStyle = theme => ({
  listItem: { paddingTop: 0, paddingBottom: 0 },
  mainItemContainer: { display: 'flex', flexBasis: '100%', width: '100%' },
  stackbarContainer: {
    display: 'flex',
    flexBasis: '60%',
    width: '60%',
    alignItems: 'center',
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3)
  },
  rightSpaceFiller: { display: 'flex', flexBasis: '15%', width: '15%' }
});
DimensionIndicator = withStyles(dimensionIndicatorStyle)(DimensionIndicator);

const dimensionStyles = theme => ({
  container: {
    backgroundColor: theme.palette.background.paper,
    minHeight: '100vh'
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4)
  },
  listItem: {
    paddingTop: 12.5,
    paddingBottom: 12.5
  },
  row: {
    '&:nth-child(2n - 1)': {
      backgroundColor: theme.palette.grey.light
    }
  },
  mainItemContainer: { display: 'flex', flexBasis: '100%', width: '100%' },
  stackbarContainer: {
    display: 'flex',
    alignItems: 'center',
    width: '60%',
    flexBasis: '60%',
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3)
  },
  priorAndAchievem: {
    width: '15%',
    display: 'flex',
    flexBasis: '15%',
    alignItems: 'center'
  },
  innerPriorAndAchievem: {
    width: '40%',
    flexBasis: '40%',
    display: 'flex',
    alignItems: 'center'
  },
  icon: {
    width: 20,
    height: 20
  },
  counting: {
    fontSize: 12,
    paddingLeft: '2px',
    paddingRight: '4px'
  },
  dimensionIndicatorContainer: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3)
  },
  dimensionIndicatorUnderline: {
    marginTop: theme.spacing(),
    width: '100%',
    height: '1px',
    backgroundColor: '#f3f4f6'
  },
  expandIcon: { color: '#626262' },
  expandContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  list: {
    padding: 0
  }
});

const Dimensions = withStyles(dimensionStyles)(({ classes, data, type }) => {
  const [dimensionOpen, setDimensionOpen] = useState(null);
  const handleDimensionClick = useCallback(
    dimensionClicked =>
      setDimensionOpen(prevDim =>
        prevDim === dimensionClicked ? null : dimensionClicked
      ),
    []
  );
  const dataWithIcons = data.map(d => ({
    ...d,
    icon: getIconForDimension(d.dimension)
  }));

  return (
    <>
      {type === BAR && (
        <List className={classes.list}>
          <Box mt={2} />
          {data.map(d => {
            const { dimension, stoplights, priorities, achievements } = d;
            return (
              <React.Fragment key={dimension}>
                <ListItem
                  className={classes.row}
                  classes={{ root: classes.listItem }}
                  onClick={() => handleDimensionClick(dimension)}
                >
                  <div className={classes.mainItemContainer}>
                    <DimensionTitle dimension={dimension} />

                    <div className={classes.stackbarContainer}>
                      <SummaryStackedBar
                        greenIndicatorCount={getIndCountByColor(stoplights, 3)}
                        yellowIndicatorCount={getIndCountByColor(stoplights, 2)}
                        redIndicatorCount={getIndCountByColor(stoplights, 1)}
                        skippedIndicatorCount={getIndCountByColor(
                          stoplights,
                          0
                        )}
                      />
                    </div>

                    <div className={classes.priorAndAchievem}>
                      <CountDetail
                        countVariant="subtitle1"
                        count={achievements}
                        type="achievement"
                        removeBorder={true}
                      />
                      <CountDetail
                        countVariant="subtitle1"
                        count={priorities}
                        type="priority"
                        removeBorder={true}
                      />
                      <div className={classes.expandContainer}>
                        {dimensionOpen === dimension ? (
                          <ExpandLess className={classes.expandIcon} />
                        ) : (
                          <ExpandMore className={classes.expandIcon} />
                        )}
                      </div>
                    </div>
                  </div>
                </ListItem>
                <Collapse
                  in={dimensionOpen === dimension}
                  timeout="auto"
                  unmountOnExit
                >
                  <div className={classes.dimensionIndicatorContainer}>
                    <DimensionIndicator dimension={d} />
                  </div>
                  <div className={classes.dimensionIndicatorUnderline} />
                </Collapse>
              </React.Fragment>
            );
          })}
        </List>
      )}
      {type === PIE && <PieGrid items={dataWithIcons} />}
    </>
  );
});

const DimensionsVisualisation = withControllers(Dimensions);

export default DimensionsVisualisation;
