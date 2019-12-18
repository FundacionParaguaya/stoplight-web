import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { updateSurvey } from '../redux/actions';
import MaterialTable from 'material-table';
import { withSnackbar } from 'notistack';
import familyFace from '../assets/family_face_large.png';
import { Delete } from '@material-ui/icons';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import { getDateFormatByLocale } from '../utils/date-utils';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import DeleteFamilyModal from './DeleteFamilyModal';
import { ROLES_NAMES, getPlatform } from '../utils/role-utils';

const useStyles = makeStyles(theme => ({
  familyContainer: {
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    //padding: theme.spacing(2),
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
    '& .MuiPaper-root > div > div:first-of-type': {
      backgroundColor: '#fff'
    }
  },
  nameLabelStyle: {
    fontSize: '14px',
    width: '100%'
  },
  documentLabel: {
    fontSize: '14px',
    color: '#909090',
    textTransform: 'capitalize'
  },

  birthDateStyle: {
    fontSize: '14px',
    color: '#909090'
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
    right: 3
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
    width: 60
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
  }
}));

const FamilyTable = ({ user, loadFamilies, tableRef, numberOfRows }) => {
  const {
    t,
    i18n: { language }
  } = useTranslation();

  const classes = useStyles();
  const [deletingFamily, setDeletingFamily] = useState({
    open: false,
    family: null
  });
  const dateFormat = getDateFormatByLocale(language);

  const actionList = () => {
    const list = [];
    if (showDeleteAction(user)) {
      list.push({
        icon: Delete,
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
      tooltip: t('views.familyList.show'),
      iconProps: {
        color: '#6A6A6A'
      },
      onClick: (event, rowData) => goToFamily(event, rowData.familyId)
    });
    return list;
  };

  const goToFamily = (e, familyId) => {
    window.location.replace(`${getPlatform(user.env)}/#families/${familyId}`);
  };

  const renderDocumentType = type => {
    type = type
      .replace(/-/gi, ' ')
      .replace(/_/gi, ' ')
      .toLowerCase();

    return type;
  };

  const showDeleteAction = ({ role }) => {
    return (
      role === ROLES_NAMES.ROLE_HUB_ADMIN ||
      role === ROLES_NAMES.ROLE_APP_ADMIN ||
      role === ROLES_NAMES.ROLE_ROOT
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
      </div>
      <MaterialTable
        tableRef={tableRef}
        options={{
          search: false,
          toolbar: false,
          actionsColumnIndex: 4,
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
          }
        }}
        columns={[
          //Column Avatar number of members
          {
            field: 'id',
            Title: 'Avatar',
            sorting: false,
            grouping: false,
            render: rowData => (
              <div className={classes.badgeNumberContainer}>
                {rowData.countFamilyMembers > 1 && (
                  <div className={classes.iconBadgeNumber}>
                    <Typography variant="h6" style={{ fontSize: 9 }}>
                      +{rowData.countFamilyMembers - 1}
                    </Typography>
                  </div>
                )}

                <img src={familyFace} className={classes.iconFamily} />
              </div>
            )
          },

          //Column Family Name
          {
            title: t('views.familyList.familyName'),
            field: 'name',
            grouping: false,
            removable: false,
            disableClick: true,
            readonly: true,
            render: rowData => (
              <div>
                <Typography
                  className={classes.nameLabelStyle}
                  variant="subtitle1"
                >
                  {rowData.name}
                </Typography>
                <Typography className={classes.birthDateStyle} variant="h6">
                  {rowData.birthDate
                    ? `${t('views.snapshotsTable.dob')} ${moment
                        .unix(rowData.birthDate)
                        .format(dateFormat)}`
                    : ''}
                </Typography>
              </div>
            )
          },
          //Column Document
          {
            title: t('views.familyList.document'),
            field: 'documentNumber',
            sorting: false,
            render: rowData => (
              <div>
                <Typography className={classes.documentLabel} variant="h6">
                  {rowData.documentTypeText
                    ? renderDocumentType(rowData.documentTypeText)
                    : ''}
                </Typography>
                <Typography
                  className={classes.nameLabelStyle}
                  variant="subtitle1"
                >
                  {rowData.documentNumber}
                </Typography>
              </div>
            )
          },
          //Column Family Code
          {
            title: t('views.familyList.familyCode'),
            field: 'code',
            sorting: false,
            render: rowData => (
              <Typography className={classes.nameLabelStyle} variant="h6">
                {rowData.code ? rowData.code : ''}
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