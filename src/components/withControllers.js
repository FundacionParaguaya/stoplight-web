import React, { useState } from 'react';
import {
  withStyles,
  Typography,
  Box,
  CircularProgress
} from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import GreyButton from './GreyButton';
import Controllers from './Controllers';
import { BAR } from '../utils/types';
import { SORT_BY_OPTIONS, sorter } from './summary/IndicatorsFilter';

const styles = theme => ({
  innerContainer: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column'
    }
  },
  title: {
    paddingRight: 10,
    [theme.breakpoints.down('xs')]: {
      width: '100%'
    }
  },
  loadingContainer: {
    width: '100%',
    minHeight: 495,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.background.default
  },
  buttonContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
  },
  generalContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column'
  }
});

function withControllers(title, sorting) {
  return WrappedComponent => {
    return withTranslation()(
      withStyles(styles)(({ data, loading, classes, t }) => {
        const [type, setType] = useState(BAR);
        const [count, setCount] = useState(10);
        const [sortingBy, setSortingBy] = useState(SORT_BY_OPTIONS.DEFAULT);

        return (
          <div className={classes.generalContainer}>
            <div className={classes.innerContainer}>
              <Typography variant="h5" className={classes.title}>
                {t(title)}
              </Typography>
              <Controllers
                type={type}
                setIndicatorsType={setType}
                sorting={sorting}
                sortingBy={sortingBy}
                onSortingChanged={setSortingBy}
              />
            </div>
            <Box mt={1} />
            {loading && (
              <div className={classes.loadingContainer}>
                <CircularProgress />
              </div>
            )}
            {!loading && Array.isArray(data) && data.length <= 0 && (
              <Typography>
                {t('views.organizationsFilter.noMatchFilters')}
              </Typography>
            )}
            {!loading && Array.isArray(data) && data.length > 0 && (
              <>
                <WrappedComponent
                  type={type}
                  data={[...data].sort(sorter(sortingBy)).slice(0, count)}
                />
                {data.length > 10 && (
                  <>
                    <Box mt={4} />
                    <div className={classes.buttonContainer}>
                      <GreyButton
                        onClick={() => setCount(prev => prev + 10)}
                        disabled={data.length < count}
                      >
                        {t('general.showMore')}
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
