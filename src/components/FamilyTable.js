import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import { withSnackbar } from 'notistack';
import { Delete } from '@material-ui/icons';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import moment from 'moment';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import familyFace from '../assets/family_face_large.png';
import { updateSurvey } from '../redux/actions';
import { getDateFormatByLocale } from '../utils/date-utils';
import DeleteFamilyModal from './DeleteFamilyModal';
import { ROLES_NAMES } from '../utils/role-utils';

//background-color: rgba(0, 0, 0, 0.04);}

const useStyles = makeStyles(theme => ({
  familyContainer: {
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    // padding: theme.spacing(2),
    width: '100%',
    zIndex: 0,
    '& .overflow-y': {
      backgroundColor: '#fff'
    },
    '& .MuiButtonBase-root:hover': {
      color: '#909090'
    },
    '& .MuiTypography-root': {
      color: '#6A6A6A',
      '&:hover': {
        color: '#909090'
      }
    },
    '& .MuiToolbar-root': {
      backgroundColor: '#fff'
    },
    '& .MuiTableSortLabel-root.MuiTableSortLabel-active.MuiTableSortLabel-root.MuiTableSortLabel-active .MuiTableSortLabel-icon': {
      color: '#6A6A6A'
    },
    '& .MuiTableSortLabel-root': {
      color: '#6A6A6A'
    },

    '& .MuiInputBase-input': {
      padding: '0px 5px'
    },
    '& .MuiTableRow-root': {
      backgroundColor: '#fff',
      color: '#fff'
    },
    '& $th:first-of-type': {
      width: '10px!important'
    },
    '& $th:last-of-type': {
      width: '40px!important'
    },
    '& .MuiPaper-root > div > div:first-of-type': {
      backgroundColor: '#fff'
    },
    '& .MuiCheckbox-root': {
      color: '#909090'
    },
    '& .MuiTableCell-root:first-of-type': {
      textAlign: 'center'
    },
    '& .MuiTableCell-root > span': {
      padding: 8,
      marginLeft: '16px !important'
    },
    '& .MuiTableCell-root > span:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)'
    }
  },
  nameLabelStyle: {
    fontSize: '14px',
    width: '100%',
    maxWidth: '30vw',
    [theme.breakpoints.down('xs')]: {
      minWidth: '55vw'
    },
    textOverflow: 'ellipsis',
    textTransform: 'capitalize',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    cursor: 'pointer'
  },
  documentLabel: {
    fontSize: '14px',
    color: '#909090',
    textTransform: 'capitalize',
    maxWidth: '30vw',
    [theme.breakpoints.down('xs')]: {
      minWidth: '55vw'
    },
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap'
  },

  birthDateStyle: {
    fontSize: '14px',
    color: '#909090',
    maxWidth: '30vw',
    [theme.breakpoints.down('xs')]: {
      minWidth: '55vw'
    },
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap'
  },
  deleteStyle: {
    cursor: 'pointer',
    fontSize: '24px',
    color: '#6A6A6A'
  },
  iconBadgeNumber: {
    border: '2px solid #FFFFFF',
    borderRadius: '50%',
    backgroundColor: '#F3F4F6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 22,
    height: 22,
    position: 'absolute',
    top: -9,
    right: -11
  },
  iconFamily: {
    maxWidth: 30,
    maxHeight: 30,
    objectFit: 'contain'
  },
  badgeNumberContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    margin: '0 auto',
    width: 30
  },
  familyCountContainer: {
    height: 37,
    width: '100%',
    opacity: 1,
    backgroundColor: '#f3f4f687',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 45
  },
  labelRows: {
    marginRight: 10,
    marginLeft: 10,
    fontSize: 14,
    height: 20
  },
  icon: {
    borderRadius: 50,
    '&:hover': {
      backgroundColor: theme.palette.background.paper,
      cursor: 'pointer'
    }
  }
}));

const FamilyTable = ({
  user,
  loadFamilies,
  tableRef,
  numberOfRows,
  redirectToFamily,
  toggleMoveModal,
  handleMoveSelected
}) => {
  const {
    t,
    i18n: { language }
  } = useTranslation();
  const classes = useStyles();
  const [deletingFamily, setDeletingFamily] = useState({
    open: false,
    family: null
  });
  const [selectedElements, setSelectedElements] = useState([]);
  const dateFormat = getDateFormatByLocale(language);

  const actionList = () => {
    const list = [];
    if (showDeleteAction(user)) {
      list.push({
        icon: Delete,
        position: 'row',
        iconProps: {
          color: '#6A6A6A'
        },
        tooltip: t('views.familyList.delete'),
        onClick: (e, rowData) => {
          e.stopPropagation();
          setDeletingFamily({ open: true, family: rowData.familyId });
        }
      });
    }
    list.push({
      icon: ArrowForwardIosIcon,
      position: 'row',
      tooltip: t('views.familyList.show'),
      iconProps: {
        color: '#6A6A6A'
      },
      onClick: (event, rowData) => redirectToFamily(event, rowData.familyId)
    });

    return list;
  };

  const renderDocumentType = type => {
    type = type
      .replace(/-/gi, ' ')
      .replace(/_/gi, ' ')
      .toLowerCase();

    return type;
  };

  const showMoveAction = ({ role }, selectedElements) => {
    return (
      (role === ROLES_NAMES.ROLE_ROOT || role === ROLES_NAMES.ROLE_HUB_ADMIN) &&
      selectedElements &&
      selectedElements.length > 0
    );
  };

  const showDeleteAction = ({ role }) => {
    return (
      role === ROLES_NAMES.ROLE_HUB_ADMIN ||
      role === ROLES_NAMES.ROLE_APP_ADMIN ||
      role === ROLES_NAMES.ROLE_ROOT
    );
  };

  const showSelectionCheckbox = ({ role }) => {
    return (
      role === ROLES_NAMES.ROLE_ROOT || role === ROLES_NAMES.ROLE_HUB_ADMIN
    );
  };
  return (
    <div className={classes.familyContainer}>
      <DeleteFamilyModal
        onClose={() => setDeletingFamily({ open: false, family: null })}
        open={deletingFamily.open}
        family={deletingFamily.family}
        tableRef={tableRef}
      />
      <div className={classes.familyCountContainer}>
        <Typography className={classes.labelRows} variant="subtitle1">
          {numberOfRows} {t('views.familyList.rows')}
        </Typography>
        {showMoveAction(user, selectedElements) && (
          <Tooltip title={'Move'} aria-label="name">
            <SwapHorizIcon
              className={classes.icon}
              onClick={() => toggleMoveModal(selectedElements)}
            />
          </Tooltip>
        )}
      </div>
      <MaterialTable
        tableRef={tableRef}
        options={{
          selection: showSelectionCheckbox(user),
          search: false,
          toolbar: false,
          actionsColumnIndex: 5,
          pageSize: 10,
          pageSizeOptions: [10],
          initialPage: 0,
          draggable: false,
          rowStyle: {
            backgroundColor: '#fff',
            color: '#626262'
          },
          headerStyle: {
            backgroundColor: '#fff',
            color: '#626262',
            fontSize: '14px'
          },
          searchFieldStyle: {
            backgroundColor: '#fff',
            color: '#626262'
          },
          actionsCellStyle: {
            maxWidth: 120
          }
        }}
        columns={[
          // Column Avatar number of members
          {
            field: 'id',
            Title: 'Avatar',
            sorting: false,
            grouping: false,
            width: '6%',
            render: rowData => (
              <div className={classes.badgeNumberContainer}>
                {rowData.countFamilyMembers > 1 && (
                  <div className={classes.iconBadgeNumber}>
                    <Typography variant="h6" style={{ fontSize: 9 }}>
                      +{rowData.countFamilyMembers - 1}
                    </Typography>
                  </div>
                )}

                <img
                  src={familyFace}
                  className={classes.iconFamily}
                  alt="Family Member"
                />
              </div>
            )
          },

          // Column Family Name
          {
            title: t('views.familyList.familyName'),
            field: 'name',
            grouping: false,
            removable: false,
            disableClick: true,
            readonly: true,
            width: '28%',
            render: rowData => {
              const birthDateText = rowData.birthDate
                ? `${t('views.snapshotsTable.dob')} ${moment
                    .unix(rowData.birthDate)
                    .utc(true)
                    .format(dateFormat)}`
                : '';
              return (
                <div>
                  <Tooltip title={rowData.name} aria-label="name">
                    <Typography
                      className={classes.nameLabelStyle}
                      variant="subtitle1"
                      onClick={event =>
                        redirectToFamily(event, rowData.familyId)
                      }
                    >
                      {rowData.name}
                    </Typography>
                  </Tooltip>
                  <Tooltip title={birthDateText} aria-label="birthDate">
                    <Typography className={classes.birthDateStyle} variant="h6">
                      {birthDateText}
                    </Typography>
                  </Tooltip>
                </div>
              );
            }
          },
          // Column Document
          {
            title: t('views.familyList.document'),
            field: 'documentNumber',
            sorting: false,
            width: '28%',
            render: rowData => (
              <div>
                <Tooltip
                  title={rowData.documentTypeText}
                  aria-label="documentTypeText"
                >
                  <Typography className={classes.documentLabel} variant="h6">
                    {rowData.documentTypeText
                      ? renderDocumentType(rowData.documentTypeText)
                      : ''}
                  </Typography>
                </Tooltip>
                <Tooltip
                  title={rowData.documentNumber}
                  aria-label="documentNumber"
                >
                  <Typography
                    className={classes.nameLabelStyle}
                    variant="subtitle1"
                  >
                    {rowData.documentNumber}
                  </Typography>
                </Tooltip>
              </div>
            )
          },
          // Column Family Code
          {
            title: t('views.familyList.familyCode'),
            field: 'code',
            sorting: false,
            width: '20%',
            render: rowData => (
              <Tooltip title={rowData.code} aria-label="code">
                <Typography className={classes.nameLabelStyle} variant="h6">
                  {rowData.code ? rowData.code : ''}
                </Typography>
              </Tooltip>
            )
          },
          // Column Family Code
          {
            title: t('views.familyList.organization'),
            field: 'org',
            sorting: false,
            width: '20%',
            render: rowData => (
              <Tooltip title={rowData.organizationName} aria-label="org">
                <Typography className={classes.nameLabelStyle} variant="h6">
                  {rowData.organizationName ? rowData.organizationName : ''}
                </Typography>
              </Tooltip>
            )
          }
        ]}
        localization={{
          pagination: {
            labelDisplayedRows: '{from}-{to} of {count}',
            labelRowsSelect: 'rows'
          },
          toolbar: {
            nRowsSelected: '{0} row(s) selected',
            searchPlaceholder: t('views.familyList.search')
          },
          header: {
            actions: ''
          },
          body: {
            emptyDataSourceMessage: t('views.familyList.empty')
          }
        }}
        data={loadFamilies}
        actions={actionList()}
        title=""
        onSelectionChange={elements => {
          console.log('elements', elements);
          setSelectedElements(elements);
        }}
      />
    </div>
  );
};

const mapStateToProps = ({ user }) => ({ user });

const mapDispatchToProps = { updateSurvey };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withSnackbar(FamilyTable));
