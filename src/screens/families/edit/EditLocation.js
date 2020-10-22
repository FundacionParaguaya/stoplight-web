import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import withLayout from '../../../components/withLayout';
import EditMap from './EditMap';

const useStyles = makeStyles(theme => ({
  main: {
    height: '100%',
    overflowY: 'auto'
  },
  mapContainer: {
    paddingTop: '3rem',
    maxWidth: '80vw',
    height: 'unset',
    maxHeight: 'unset',
    margin: 'auto',
    position: 'relative'
  },
  mapElement: {
    height: '72vh',
    maxHeight: '72vh'
  }
}));

const EditLocation = ({ history }) => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <div className={classes.main}>
        <EditMap
          history={history}
          loadingElement={<div className={classes.mapContainer} />}
          containerElement={<div className={classes.mapContainer} />}
          mapElement={<div className={classes.mapElement} />}
        />
      </div>
    </React.Fragment>
  );
};

export default withLayout(EditLocation);
