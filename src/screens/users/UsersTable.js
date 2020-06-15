import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import { withSnackbar } from 'notistack';
import userFace from '../../assets/family_face_large.png';
import { Delete } from '@material-ui/icons';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import EditIcon from '@material-ui/icons/Edit';
import { ROLES_NAMES } from '../../utils/role-utils';
import UserDeleteModal from './UserDeleteModal';

const useStyles = makeStyles(theme => ({
  userListContainer: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    '& .overflow-y': {
      backgroundColor: theme.palette.background.default
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
    '& $th:first-of-type': {
      width: '10px!important'
    },
    '& $tbody > tr > td:first-of-type': {
      width: '10px!important'
    },
    '& .MuiPaper-root > div > div:first-of-type': {
      backgroundColor: theme.palette.background.default
    }
  },
  labelStyle: {
    fontSize: '14px',
    width: '100%',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap'
  },
  name: {
    maxWidth: '12vw',
    fontSize: '14px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap'
  },
  iconUser: {
    maxWidth: 30,
    maxHeight: 30,
    objectFit: 'contain'
  },
  badgeNumberContainer: {
    justifyContent: 'center',
    display: 'flex',
    margin: 'auto'
  },
  email: {
    maxWidth: '15vw',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  },
  userCountContainer: {
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
  stackedLabels: {
    marginLeft: 2,
    fontWeight: 400,
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  }
}));

const UsersTable = ({
  user,
  loadUsers,
  tableRef,
  numberOfRows,
  toggleFormModal,
  loading
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [selectedUser, setSelectedUser] = useState();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const actionList = () => {
    const list = [];
    list.push(rowData => ({
      icon: EditIcon,
      tooltip: t('views.user.userList.edit'),
      iconProps: {
        color: '#6A6A6A'
      },
      onClick: (e, rowData) => {
        e.stopPropagation();
        toggleFormModal(rowData);
      },
      disabled: rowData.role === user.role
    }));

    list.push(rowData => ({
      icon: Delete,
      iconProps: {
        color: '#6A6A6A'
      },
      tooltip: t('views.user.userList.delete'),
      onClick: (e, rowData) => {
        e.stopPropagation();
        setSelectedUser(rowData);
        setOpenDeleteModal(true);
      },
      disabled:
        rowData.role === user.role || user.role === ROLES_NAMES.ROLE_PS_TEAM
    }));

    return list;
  };

  const showHubName = (hub, { role }) =>
    !!hub &&
    (role === ROLES_NAMES.ROLE_ROOT || role === ROLES_NAMES.ROLE_PS_TEAM);

  const toggleDeleteModal = () => {
    setOpenDeleteModal(!openDeleteModal);
  };

  const afterSubmit = () => {
    tableRef.current.onQueryChange();
  };

  const showCountLabel = numberOfRows => {
    if (numberOfRows === 0) {
      return t('views.user.userList.noRows');
    } else if (numberOfRows === 1) {
      return `${numberOfRows} ${t('views.user.userList.singleRow')}`;
    } else {
      return `${numberOfRows} ${t('views.user.userList.rows')}`;
    }
  };

  return (
    <div className={classes.userListContainer}>
      <UserDeleteModal
        userToDelete={selectedUser}
        open={openDeleteModal}
        afterSubmit={afterSubmit}
        toggleModal={toggleDeleteModal}
      />
      <div className={classes.userCountContainer}>
        <Typography className={classes.labelRows} variant="subtitle1">
          {showCountLabel(numberOfRows)}
        </Typography>
      </div>
      <MaterialTable
        isLoading={loading}
        tableRef={tableRef}
        options={{
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
          }
        }}
        columns={[
          //Column User avatar
          {
            field: 'id',
            Title: 'Avatar',
            sorting: false,
            grouping: false,
            render: rowData => (
              <div className={classes.badgeNumberContainer}>
                <img
                  src={userFace}
                  className={classes.iconUser}
                  style={{ filter: !rowData.active && 'brightness(1.35)' }}
                  alt="User"
                />
              </div>
            )
          },

          //Column Username
          {
            title: t('views.user.userList.username'),
            field: 'username',
            grouping: false,
            removable: false,
            disableClick: true,
            readonly: true,
            render: rowData => (
              <React.Fragment>
                <Typography className={classes.name} variant="subtitle1">
                  {rowData.username}
                </Typography>
                <Tooltip title={rowData.name} aria-label="name">
                  <Typography
                    variant="subtitle1"
                    className={classes.name}
                    style={{ display: 'flex' }}
                  >
                    {`${t('views.user.userList.name')}: `}
                    <div className={classes.stackedLabels}>
                      {rowData.name ? rowData.name : ''}
                    </div>
                  </Typography>
                </Tooltip>
              </React.Fragment>
            )
          },
          //Column email
          {
            title: t('views.user.userList.email'),
            field: 'email',
            sorting: false,
            render: rowData => (
              <Tooltip title={rowData.email} aria-label="email">
                <Typography variant="subtitle2" className={classes.email}>
                  {rowData.email}
                </Typography>
              </Tooltip>
            )
          },
          //Column role
          {
            title: t('views.user.userList.role'),
            field: 'role',
            render: rowData => (
              <Tooltip title={t(`role.${rowData.role}`)} aria-label="role">
                <Typography className={classes.labelStyle} variant="h6">
                  {t(`role.${rowData.role}`)}
                </Typography>
              </Tooltip>
            )
          },
          //Column organization
          {
            title: t('views.user.userList.organization'),
            field: 'organization',
            sorting: false,
            render: rowData => (
              <div className={classes.name}>
                <Tooltip title={rowData.organizationName} aria-label="orgName">
                  <Typography
                    className={classes.labelStyle}
                    variant="subtitle2"
                  >
                    {rowData.organizationName}
                  </Typography>
                </Tooltip>
                {showHubName(rowData.hubName, user) && (
                  <Tooltip title={rowData.hubName} aria-label="hubName">
                    <Typography
                      variant="subtitle1"
                      className={classes.labelStyle}
                      style={{ display: 'flex' }}
                    >
                      {`${t('views.user.userList.hub')}: `}
                      <div className={classes.stackedLabels}>
                        {rowData.hubName}
                      </div>
                    </Typography>
                  </Tooltip>
                )}
              </div>
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
            searchPlaceholder: t('views.user.userList.search')
          },
          header: {
            actions: ''
          },
          body: {
            emptyDataSourceMessage: t('views.user.userList.empty')
          }
        }}
        data={loadUsers}
        actions={actionList()}
        title=""
      />
    </div>
  );
};

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(withSnackbar(UsersTable));
