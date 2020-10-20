import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import withLayout from '../../../components/withLayout';
import EditMap from './EditMap';

const useStyles = makeStyles(theme => ({
  mapContainer: {
    paddingTop: '3rem',
    maxWidth: '80vw',
    height: '72vh',
    maxHeight: '72vh',
    margin: 'auto'
  }
}));

const EditLocation = ({ history }) => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <EditMap
        history={history}
        loadingElement={<div className={classes.mapContainer} />}
        containerElement={<div className={classes.mapContainer} />}
        mapElement={<div className={classes.mapContainer} />}
      />
    </React.Fragment>
  );
};

export default withLayout(EditLocation);
