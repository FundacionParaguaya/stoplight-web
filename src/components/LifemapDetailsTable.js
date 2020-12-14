import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import { getDateFormatByLocale } from '../utils/date-utils';
import { withSnackbar } from 'notistack';
import MaterialTable from 'material-table';
import IndicatorBall from './summary/IndicatorBall';
import { theme } from '../theme';

const useStyles = makeStyles(theme => ({
  familyContainer: {
    zIndex: 2,
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    paddingTop: 50,
    paddingLeft: '12%',
    paddingRight: '12%',
    '& $tfoot': {
      backgroundColor: theme.palette.background.default
    },
    '& $tfoot > tr': {
      visibility: 'hidden'
    }
  },
  columnHeader: {
    textAlign: 'center',
    margin: 'auto'
  },
  indicatorsTitle: {
    fontSize: 22,
    fontWeight: 600
  }
}));

const LifemapDetailsTable = ({
  tableRef,
  loadData,
  numberOfRows,
  snapshots
}) => {
  const {
    t,
    i18n: { language }
  } = useTranslation();
  const classes = useStyles();
  const dateFormat = getDateFormatByLocale(language);

  const indicatorColorByAnswer = indicator => {
    let color;
    if (!indicator) {
      color = 'skipped';
    } else if (indicator.value === 3) {
      color = 'green';
    } else if (indicator.value === 2) {
      color = 'yellow';
    } else if (indicator.value === 1) {
      color = 'red';
    } else if (indicator.value === 0) {
      color = 'skipped';
    }
    return color;
  };

  const getColumns = () => {
    let columns = [];
    let count = 0;
    snapshots.forEach((snapshot, i) => {
      if (!snapshot.stoplightSkipped) {
        count += 1;
        columns.push({
          title: (
            <Typography variant="h6" className={classes.columnHeader}>
              <div style={{ fontWeight: 600, marginBottom: -5 }}>
                {`${t('views.familyProfile.stoplight')} ${count}`}
              </div>
              {`${moment
                .unix(snapshot.snapshotDate)
                .utc(true)
                .format(dateFormat)}`}
            </Typography>
          ),
          field: `column ${i}`,
          sorting: false,
          grouping: false,
          cellStyle: {
            borderBottom: '0px',
            borderRight: `1px solid ${theme.palette.grey.quarter}`,
            width: '100px'
          },
          width: '100px',
          render: rowData => {
            let indicator = rowData.values.find(d => d.column === i);
            indicator = indicator ? indicator : {};
            return (
              <div style={{ margin: 'auto', width: 42 }}>
                <IndicatorBall
                  color={indicatorColorByAnswer(indicator)}
                  animated={false}
                  priority={indicator.priority}
                  achievement={indicator.achievement}
                  variant={'medium'}
                  accentStyle={{ top: -6, right: -8 }}
                />
              </div>
            );
          }
        });
      }
    });

    columns.push({
      title: (
        <Typography variant="h6" className={classes.indicatorsTitle}>
          {`${t('views.survey.indicators')}`}
        </Typography>
      ),
      field: 'indicators',
      sorting: false,
      grouping: false,
      cellStyle: {
        borderBottom: '0px'
      },
      render: rowData => (
        <div style={{ textAlign: 'left' }}>
          <Typography variant="h6" style={{ textAlign: 'left' }}>
            {rowData.lifemapName}
          </Typography>
        </div>
      )
    });
    return columns;
  };

  return (
    <div className={classes.familyContainer}>
      <MaterialTable
        tableRef={tableRef}
        options={{
          search: false,
          toolbar: false,
          pageSize: numberOfRows,
          pageSizeOptions: [],
          draggable: false,
          fixedColumns: {
            left: snapshots.length
          },
          rowStyle: rowData => ({
            backgroundColor:
              rowData.tableData.id % 2 === 0
                ? theme.palette.background.default
                : theme.palette.grey.light,
            height: 50
          }),
          cellStyle: {
            width: '100px',
            minWidth: '100px'
          },
          headerStyle: {
            backgroundColor: theme.palette.background.paper,
            height: 70,
            color: theme.typography.h4.color,
            fontSize: '14px',
            borderRight: `1px solid ${theme.palette.grey.quarter}`,
            width: '100px',
            minWidth: '100px'
          },
          searchFieldStyle: {
            backgroundColor: theme.palette.background.default,
            color: theme.typography.h4.color
          }
        }}
        columns={getColumns()}
        localization={{
          header: {
            actions: ''
          },
          body: {
            emptyDataSourceMessage: t('views.familyProfile.loadingSnapshots')
          }
        }}
        data={loadData}
        title=""
      />
    </div>
  );
};

export default withSnackbar(LifemapDetailsTable);
