import React, { useState } from 'react';
import {
  withStyles,
  Typography,
  Box,
  CircularProgress
} from '@material-ui/core';
import { useTheme } from '@material-ui/styles';
import { withTranslation } from 'react-i18next';
import GreyButton from './GreyButton';
import Controllers from './Controllers';
import { BAR } from '../utils/types';

const styles = theme => ({
  innerContainer: {
    display: 'flex',
    alignItems: 'center',
    width: '100%'
  },
  loadingContainer: {
    width: '100%',
    minHeight: 495,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.grey.light
  },
  buttonContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
  }
});

function withControllers(title) {
  return WrappedComponent => {
    return withTranslation()(
      withStyles(styles)(({ loading, classes, t, ...props }) => {
        const [type, setType] = useState(BAR);
        const [count, setCount] = useState(10);
        const theme = useTheme();

        return (
          <div>
            <div className={classes.innerContainer}>
              <Typography variant="h5">{t(title)}</Typography>
              <Controllers type={type} setIndicatorsType={setType} />
            </div>
            <Box mt={1} />
            {loading && (
              <div className={classes.loadingContainer}>
                <CircularProgress
                  size={50}
                  thickness={2}
                  style={{ color: theme.palette.grey.main }}
                />
              </div>
            )}
            {!loading && props.data.length > 0 && (
              <>
                <WrappedComponent
                  type={type}
                  data={props.data.slice(0, count)}
                />
                {props.data.length > 10 && (
                  <>
                    <Box mt={4} />
                    <div className={classes.buttonContainer}>
                      <GreyButton
                        onClick={() => setCount(prev => prev + 10)}
                        disabled={props.data.length < count}
                      >
                        Show more
                      </GreyButton>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        );
      })
    );
  };
}

export default withControllers;
