import React, { useState, useCallback, useEffect } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import TitleBar from '../components/TitleBar';
import BottomSpacer from '../components/BottomSpacer';
import Container from '../components/Container';
import SummaryStackedBar from '../components/summary/SummaryStackedBar';
import iconPriority from '../assets/icon_priority.png';
import iconAchievement from '../assets/icon_achievement.png';

const fakeData = {
  'Ingreso y Empleo': {
    green: 25,
    yellow: 7,
    red: 15,
    skipped: 10,
    priorities: 520,
    achievements: 33
  },
  'Salud y Medioambiente': {
    green: 21,
    yellow: 12,
    red: 3,
    skipped: 2,
    priorities: 110,
    achievements: 834
  },
  'Vivienda e Infraestructura': {
    green: 13,
    yellow: 16,
    red: 25,
    skipped: 6,
    priorities: 60,
    achievements: 100
  },
  'Organizacion y participacion': {
    green: 5,
    yellow: 23,
    red: 12,
    skipped: 10,
    priorities: 0,
    achievements: 312
  }
};
Object.keys(fakeData).forEach(
  fd => (fakeData[fd].indicators = { ...fakeData })
);

let DimensionTitle = ({ classes, dimension, excludeIcon }) => (
  <div className={classes.mainContainer}>
    {excludeIcon && <div style={{ width: '20%' }} />}
    {!excludeIcon && <div style={{ width: '20%' }} />}
    <Typography className={classes.title} variant="subtitle1">
      {dimension}
    </Typography>
  </div>
);
DimensionTitle.defaultProps = {
  excludeIcon: false
};

const dimensionTitleStyle = () => ({
  mainContainer: {
    width: '25%',
    display: 'flex',
    alignItems: 'center'
  },
  title: {
    fontSize: 12
  }
});
DimensionTitle = withStyles(dimensionTitleStyle)(DimensionTitle);

let DimensionIndicator = ({ classes, dimension }) => (
  <React.Fragment>
    {Object.keys(dimension.indicators).map(indicator => {
      const indicatorData = dimension.indicators[indicator];
      return (
        <ListItem key={indicator} classes={{ root: classes.listItem }}>
          <div className={classes.mainItemContainer}>
            <DimensionTitle dimension={indicator} excludeIcon />
            <div className={classes.stackbarContainer}>
              <SummaryStackedBar
                greenIndicatorCount={indicatorData.green}
                yellowIndicatorCount={indicatorData.yellow}
                redIndicatorCount={indicatorData.red}
                skippedIndicatorCount={indicatorData.skipped}
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
  mainItemContainer: { display: 'flex', flex: '1' },
  stackbarContainer: {
    display: 'flex',
    alignItems: 'center',
    width: '60%',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3
  },
  rightSpaceFiller: { width: '15%' }
});
DimensionIndicator = withStyles(dimensionIndicatorStyle)(DimensionIndicator);

const Dashboard = props => {
  const { t, classes } = props;
  const [loading, setLoading] = useState(true);
  const [dimensionOpen, setDimensionOpen] = useState(null);
  const handleDimensionClick = useCallback(
    dimensionClicked =>
      setDimensionOpen(prevDim =>
        prevDim === dimensionClicked ? null : dimensionClicked
      ),
    []
  );
  useEffect(() => {
    setTimeout(() => setLoading(false), 3000);
  }, []);
  return (
    <div>
      <TitleBar title="Dashboard" />
      <Container variant="stretch">
        {loading && (
          <div className={classes.loadingContainer}>
            <CircularProgress size={50} thickness={2} />
          </div>
        )}
        {!loading && (
          <List>
            {Object.keys(fakeData).map(d => {
              const dimension = fakeData[d];
              return (
                <React.Fragment key={d}>
                  <ListItem
                    className={classes.row}
                    classes={{ root: classes.listItem }}
                    onClick={() => handleDimensionClick(d)}
                  >
                    <div className={classes.mainItemContainer}>
                      <DimensionTitle dimension={d} />

                      <div className={classes.stackbarContainer}>
                        <SummaryStackedBar
                          greenIndicatorCount={dimension.green}
                          yellowIndicatorCount={dimension.yellow}
                          redIndicatorCount={dimension.red}
                          skippedIndicatorCount={dimension.skipped}
                          animationDuration={500}
                        />
                      </div>

                      <div className={classes.priorAndAchievem}>
                        <div className={classes.innerPriorAndAchievem}>
                          <img
                            src={iconPriority}
                            className={classes.icon}
                            alt=""
                          />
                          <Typography variant="h5" className={classes.counting}>
                            {Number.parseInt(dimension.priorities, 10)}
                          </Typography>
                        </div>
                        <div className={classes.innerPriorAndAchievem}>
                          <img
                            src={iconAchievement}
                            className={classes.icon}
                            alt=""
                          />
                          <Typography variant="h5" className={classes.counting}>
                            {Number.parseInt(dimension.achievements, 10)}
                          </Typography>
                        </div>
                        <div className={classes.expandContainer}>
                          {dimensionOpen === d ? (
                            <ExpandLess className={classes.expandIcon} />
                          ) : (
                            <ExpandMore className={classes.expandIcon} />
                          )}
                        </div>
                      </div>
                    </div>
                  </ListItem>
                  <Collapse
                    in={dimensionOpen === d}
                    timeout="auto"
                    unmountOnExit
                  >
                    <div className={classes.dimensionIndicatorContainer}>
                      <DimensionIndicator dimension={dimension} />
                    </div>
                    <div className={classes.dimensionIndicatorUnderline} />
                  </Collapse>
                </React.Fragment>
              );
            })}
          </List>
        )}
        <BottomSpacer />
      </Container>
    </div>
  );
};
const styles = theme => ({
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 4
  },
  listItem: {
    paddingTop: 4,
    paddingBottom: 4
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: '#f3f4f6'
    }
  },
  mainItemContainer: { display: 'flex', flex: '1' },
  stackbarContainer: {
    display: 'flex',
    alignItems: 'center',
    width: '60%',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3
  },
  priorAndAchievem: {
    width: '15%',
    display: 'flex'
  },
  innerPriorAndAchievem: {
    width: '40%',
    display: 'flex',
    alignItems: 'center'
  },
  icon: {
    width: 20,
    height: 20
  },
  counting: {
    fontSize: 12,
    marginLeft: '2px',
    marginRight: '4px'
  },
  dimensionIndicatorContainer: {
    marginTop: theme.spacing.unit
  },
  dimensionIndicatorUnderline: {
    marginTop: theme.spacing.unit,
    width: '100%',
    height: '1px',
    backgroundColor: '#f3f4f6'
  },
  expandIcon: { color: '#626262' },
  expandContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end'
  }
});

export default withStyles(styles)(withTranslation()(Dashboard));
