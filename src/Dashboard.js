import React, { useEffect, useState } from 'react';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import { isArray, capitalize } from 'lodash';
import { getFamilies, getDimensionIndicators } from './api';
import withLayout from './components/withLayout';
import Container from './components/Container';
import GreenLineChart from './components/GreenLineChart';
import ActivityFeed from './components/ActivityFeed';
import FamilyOverviewBlock from './components/FamiliesOverviewBlock';
import OverviewBlock from './components/OverviewBlock';
import DimensionsVisualisation from './components/DimensionsVisualisation';
import IndicatorsVisualisation from './components/IndicatorsVisualisation';

const chartData = [
  { date: '2019-05-13T00:00', surveys: 750 },
  { date: '2019-01-15T00:00', surveys: 560 },
  { date: '2019-07-16T00:00', surveys: 1280 },
  { date: '2019-08-23T00:00', surveys: 400 },
  { date: '2019-09-04T00:00', surveys: 1400 },
  { date: '2019-10-14T00:00', surveys: 1300 }
];

const Dashboard = ({ classes, user }) => {
  const [feed, setFeed] = useState(null);
  // const [overview, setOverview] = useState(null);
  const [indicators, setIndicators] = useState(null);
  const [dimensions, setDimensions] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFamilies(user).then(families => setFeed(families.data.splice(0, 25)));

    // eslint-disable-next-line func-names
    (async function() {
      const dimensionData = await getDimensionIndicators(user);

      // we verify data exist
      const dimensionIndicators =
        dimensionData.data && dimensionData.data.data
          ? dimensionData.data.data.dimensionIndicators
          : null;

      let indicatorsArray = [];

      // eslint-disable-next-line no-shadow
      dimensionIndicators.forEach(({ indicators }) => {
        if (isArray(indicators)) {
          indicatorsArray = [...indicatorsArray, ...indicators];
        }
      });

      setIndicators(indicatorsArray);
      setDimensions(dimensionIndicators);
      setLoading(Boolean(!dimensionData));
    })();
  }, [user]);

  return (
    <Container variant="fluid" className={classes.container}>
      <Container className={classes.titleBar}>
        <Typography variant="h4">
          Welcome {capitalize(user.username)}
        </Typography>
      </Container>
      <Container className={classes.operations}>
        <Typography variant="h5">Operations</Typography>
        <div className={classes.operationsContainer}>
          <GreenLineChart width="65%" height={220} data={chartData} />
          <ActivityFeed data={feed} width="35%" height={300} />
        </div>
      </Container>
      <Container className={classes.socialEconomics}>
        <Typography variant="h5">Social Economics</Typography>
        {/* <FamilyOverviewBlock /> */}
        <OverviewBlock />
      </Container>
      <Container className={classes.whiteContainer}>
        <DimensionsVisualisation data={dimensions} />
      </Container>
      <Container className={classes.whiteContainer}>
        <IndicatorsVisualisation data={indicators} />
      </Container>
    </Container>
  );
};

const styles = theme => ({
  container: {
    backgroundColor: theme.palette.background.paper
  },
  titleBar: {
    paddingTop: theme.spacing(5),
    paddingBottom: theme.spacing(5)
  },
  operations: {
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(5),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(),
    marginBottom: theme.spacing(5)
  },
  operationsContainer: {
    paddingTop: theme.spacing(5),
    display: 'flex'
  },
  socialEconomics: {
    padding: theme.spacing(5),
    backgroundColor: theme.palette.background.default,
    marginBottom: theme.spacing(5)
  },
  whiteContainer: {
    padding: theme.spacing(5),
    backgroundColor: theme.palette.background.default,
    marginBottom: theme.spacing(5)
  }
});

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(
  withStyles(styles)(withLayout(Dashboard))
);
