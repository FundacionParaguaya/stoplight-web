import React from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import MaterialTable, { MTableBody } from 'material-table';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import { getDateFormatByLocale } from '../../utils/date-utils';
import { Link } from 'react-router-dom';
import { theme, COLORS } from '../../theme';
import InfoIcon from '@material-ui/icons/Info';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import { ROLES_NAMES } from '../../utils/role-utils';

const useStyles = makeStyles(theme => ({
  familyContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    '& .overflow-y': {
      backgroundColor: theme.palette.background.default
    },
    '&  .MuiPaper-root > div > div > div > div > table': {
      height: 540
    },
    '& .MuiButtonBase-root:hover': {
      color: theme.palette.grey.main
    },
    '& .MuiTypography-root': {
      color: theme.palette.grey.middle,
      '&:hover': {
        color: theme.palette.grey.main
      }
    },
    '& .MuiToolbar-root': {
      backgroundColor: theme.palette.background.default
    },
    '& .MuiTableSortLabel-root.MuiTableSortLabel-active.MuiTableSortLabel-root.MuiTableSortLabel-active .MuiTableSortLabel-icon': {
      color: theme.palette.grey.middle
    },
    '& .MuiTableSortLabel-root': {
      color: theme.palette.grey.middle
    },

    '& .MuiInputBase-input': {
      padding: '0px 5px'
    },
    '& .MuiTableRow-root': {
      backgroundColor: theme.palette.background.default,
      color: theme.palette.background.default
    },
    '& .MuiPaper-root > div > div:first-of-type': {
      backgroundColor: theme.palette.background.default
    }
  },
  nameLabelStyle: {
    fontSize: '14px',
    width: '100%',
    fontWeight: 500,
    textTransform: 'capitalize',
    color: theme.palette.grey.middle,
    textDecoration: 'none',
    '&:hover': {
      color: theme.palette.grey.main
    }
  },
  surveyDate: {
    fontSize: 14,
    color: theme.palette.grey.middle
  },
  familyCountContainer: {
    height: 37,
    width: '100%',
    opacity: 1,
    backgroundColor: '#f3f4f687',
    display: 'flex',
    alignItems: 'center'
  },
  labelRows: {
    marginRight: 10,
    marginLeft: 10,
    fontSize: 14,
    height: 20
  },
  bodyContainer: {
    backgroundColor: theme.palette.background.default
  },
  messageContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50vh'
  },
  messageIcon: {
    height: 40,
    width: 40
  },
  message: {
    width: '30vw',
    fontSize: 20,
    fontWeight: 500,
    textAlign: 'center'
  }
}));

const ReportTable = ({
  loadFamilies,
  tableRef,
  numberOfRows,
  totalFamilies,
  hideColumns,
  user
}) => {
  const {
    t,
    i18n: { language }
  } = useTranslation();
  const classes = useStyles();

  const dateFormat = getDateFormatByLocale(language);

  const getCountText = (numberOfRows, totalFamilies) => {
    if (hideColumns) {
      return '';
    } else if (totalFamilies === 0 || numberOfRows === 0) {
      return t('views.report.table.noRecords');
    }

    let surveysText =
      numberOfRows === 1
        ? t('views.report.table.singleSurvey')
        : t('views.report.table.surveys');

    let representText =
      parseInt(totalFamilies) === 1
        ? t('views.report.table.represent')
        : t('views.report.table.represents');

    let familiesText =
      parseInt(totalFamilies) === 1
        ? t('views.report.table.singleFamily')
        : t('views.report.table.families');
    return `${numberOfRows} ${surveysText} - ${representText} ${totalFamilies} ${familiesText}`;
  };

  const isPsteam = ({ role }) => role === ROLES_NAMES.ROLE_PS_TEAM;

  return (
    <div className={classes.familyContainer}>
      <div className={classes.familyCountContainer}>
        <Typography className={classes.labelRows} variant="subtitle1">
          {getCountText(numberOfRows, totalFamilies)}
        </Typography>
      </div>
      <MaterialTable
        tableRef={tableRef}
        components={{
          Body: props => {
            return numberOfRows !== 0 ? (
              <MTableBody {...props} />
            ) : (
              /* I had to do this to get rid off the #$%#$#$ warnings */
              <tbody className={classes.bodyContainer}>
                <tr>
                  <td></td>
                  <td>
                    <div className={classes.messageContainer}>
                      {hideColumns ? (
                        <React.Fragment>
                          <InfoIcon
                            className={classes.messageIcon}
                            style={{ color: COLORS.GREEN }}
                          />
                          <Typography className={classes.message} variant="h5">
                            {t('views.report.table.chooseFilters')}
                            <span style={{ color: COLORS.GREEN }}>
                              {t('views.report.buttons.applyFilters')}
                            </span>
                            {t('views.report.table.chooseFiltersEnd')}
                          </Typography>
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          <PriorityHighIcon
                            className={classes.messageIcon}
                            style={{ color: COLORS.RED }}
                          />
                          <Typography className={classes.message} variant="h5">
                            {t('views.report.table.empty')}
                          </Typography>
                        </React.Fragment>
                      )}
                    </div>
                  </td>
                  <td></td>
                </tr>
              </tbody>
            );
          }
        }}
        options={{
          search: false,
          toolbar: false,
          pageSize: 10,
          pageSizeOptions: [10],
          initialPage: 0,
          draggable: false,
          rowStyle: {
            backgroundColor: theme.palette.background.default,
            color: theme.typography.h4.color
          },
          headerStyle: {
            backgroundColor: theme.palette.background.default,
            color: theme.typography.h4.color,
            fontSize: 14
          },
          searchFieldStyle: {
            backgroundColor: theme.palette.background.default,
            color: theme.typography.h4.color
          },
          actionsCellStyle: {
            maxWidth: 50
          }
        }}
        columns={[
          //Column Family Name or Code name
          {
            title: isPsteam(user)
              ? t('views.report.table.familyCode')
              : t('views.report.table.familyName'),
            field: isPsteam(user) ? 'familyCode' : 'familyName',
            grouping: false,
            removable: false,
            disableClick: true,
            readonly: true,
            hidden: hideColumns,
            render: rowData => {
              return isPsteam(user) ? (
                <Typography className={classes.nameLabelStyle} variant="h6">
                  {rowData.familyCode}
                </Typography>
              ) : (
                <Link
                  to={`/family/${rowData.family}`}
                  className={classes.nameLabelStyle}
                >
                  {rowData.familyName}
                </Link>
              );
            }
          },
          // Survey Date
          {
            title: t('views.report.table.surveyDate'),
            field: 'surveyDate',
            hidden: hideColumns,
            render: rowData => (
              <Typography className={classes.surveyDate} variant="h6">
                {rowData.surveyDate
                  ? `${moment
                      .unix(rowData.surveyDate)
                      .utc()
                      .format(dateFormat)}`
                  : ''}
              </Typography>
            )
          },
          //Column Survey Number
          {
            title: t('views.report.table.surveyNumber'),
            field: 'surveyNumber',
            hidden: hideColumns,
            sorting: false,
            render: rowData => (
              <Typography className={classes.nameLabelStyle} variant="h6">
                {`N° ${rowData.surveyNumber}`}
              </Typography>
            )
          }
        ]}
        localization={{
          pagination: {
            labelDisplayedRows: '{from}-{to} of {count}',
            labelRowsSelect: 'rows'
          },
          toolbar: {
            nRowsSelected: '{0} row(s) selected'
          },
          header: {
            actions: ''
          },
          body: {
            emptyDataSourceMessage: hideColumns
              ? t('views.report.table.chooseFilters')
              : t('views.report.table.empty')
          }
        }}
        data={loadFamilies}
        title=""
      />
    </div>
  );
};

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(ReportTable);
