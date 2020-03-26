import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import { getDateFormatByLocale } from '../utils/date-utils';
import { withSnackbar } from 'notistack';
import MaterialTable from 'material-table';
import IndicatorBall from './summary/IndicatorBall';

const useStyles = makeStyles(theme => ({
  familyContainer: {
    zIndex: 2,
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    paddingTop: 30,
    paddingLeft: 30,
    paddingRight: 30,
    '& $tfoot': {
      backgroundColor: '#FFF'
    },
    '& $tfoot > tr': {
      visibility: 'hidden'
    }
  },
  columnHeader: {
    textAlign: 'left',
    fontWeight: 500,
    width: 100,
    margin: 'auto'
  }
}));

const LifemapDetailsTable = ({ tableRef, loadData, numberOfRows, isLast }) => {
  const {
    t,
    i18n: { language }
  } = useTranslation();
  const classes = useStyles();
  const dateFormat = getDateFormatByLocale(language);

  const indicatorColorByAnswer = indicator => {
    let color;
    if (indicator.value === 3) {
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
    let columns = [
      {
        title: (
          <Typography variant="h6" className={classes.columnHeader}>
            {`${t('views.familyProfile.stoplight')} 1 Mar 3, 2019`}
          </Typography>
        ),
        field: 'id',
        sorting: false,
        grouping: false,
        cellStyle: {
          borderBottom: '0px',
          borderRight: '1px solid #DCDEE3',
          width: '15%'
        },
        render: rowData => (
          <div style={{ margin: 'auto', width: 24 }}>
            <IndicatorBall
              color={indicatorColorByAnswer(rowData)}
              animated={false}
              priority={false}
              achievement={true}
              variant={'medium'}
            />
          </div>
        )
      }
    ];
    isLast &&
      columns.push({
        title: (
          <Typography variant="h6" style={{ fontSize: 22, fontWeight: 600 }}>
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
              {rowData.shortName}
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
          rowStyle: rowData => ({
            backgroundColor:
              rowData.tableData.id % 2 == 0 ? '#FFF' : 'rgba(243,244,246,0.05)',
            height: 50
          }),
          headerStyle: {
            backgroundColor: '#F3F4F6',
            height: 70,
            color: '#626262',
            fontSize: '14px',
            borderRight: '1px solid #DCDEE3'
          },
          searchFieldStyle: {
            backgroundColor: '#fff',
            color: '#626262'
          }
        }}
        columns={getColumns()}
        localization={{
          header: {
            actions: ''
          },
          body: {
            emptyDataSourceMessage: t('views.familyList.empty')
          }
        }}
        data={loadData}
        title=""
      />
    </div>
  );
};

export default withSnackbar(LifemapDetailsTable);
