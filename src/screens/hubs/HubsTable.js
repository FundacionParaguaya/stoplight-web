import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { Delete } from '@material-ui/icons';
import EditIcon from '@material-ui/icons/Edit';
import MaterialTable from 'material-table';
import { withSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import DefaultHubLogo from '../../assets/icon_logo_hub.png';
import { theme } from '../../theme';
import DeleteHubModal from './DeleteHubModal';
import HubPermissionsModal from './HubPermissionsModal';
import SettingsIcon from '@material-ui/icons/Settings';

const showType = type => {
  const partnerTypeOptions = [
    { label: 'Hub', value: 'HUB' },
    { label: 'Special Project', value: 'SPECIAL_PROJECT' }
  ];

  return partnerTypeOptions.find(t => t.value === type).label;
};

const useStyles = makeStyles(theme => ({
  userListContainer: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    marginTop: 25,
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
  hubLogo: {
    width: 80,
    height: 60,
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
    backgroundColor: theme.palette.primary.grey,
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

const HubsTable = ({
  loadHubs,
  tableRef,
  numberOfRows,
  loading,
  toggleFormModal
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [selectedHub, setSelectedHub] = useState({});
  const [openPermissionsModal, setOpenPermissionsModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const actionList = () => {
    const list = [];
    list.push(() => ({
      icon: SettingsIcon,
      tooltip: t('views.hub.editButton'),
      iconProps: {
        color: theme.palette.grey.middle
      },
      onClick: (e, rowData) => {
        e.stopPropagation();
        setSelectedHub(rowData);
        setOpenPermissionsModal(true);
      }
    }));

    list.push(() => ({
      icon: EditIcon,
      tooltip: t('views.hub.editButton'),
      iconProps: {
        color: theme.palette.grey.middle
      },
      onClick: (e, rowData) => {
        e.stopPropagation();
        toggleFormModal(rowData);
      }
    }));

    list.push(() => ({
      icon: Delete,
      iconProps: {
        color: theme.palette.grey.middle
      },
      tooltip: t('views.hub.deleteButton'),
      onClick: (e, rowData) => {
        e.stopPropagation();
        setSelectedHub(rowData);
        setOpenDeleteModal(true);
      }
    }));

    return list;
  };

  const afterSubmit = () => {
    tableRef.current.onQueryChange();
  };

  const showCountLabel = numberOfRows => {
    if (numberOfRows === 0) {
      return t('views.hub.list.noRows');
    } else if (numberOfRows === 1) {
      return `${numberOfRows} ${t('views.hub.list.singleRow')}`;
    } else {
      return `${numberOfRows} ${t('views.hub.list.rows')}`;
    }
  };

  return (
    <div className={classes.userListContainer}>
      <HubPermissionsModal
        hub={selectedHub}
        open={openPermissionsModal}
        afterSubmit={afterSubmit}
        toggleModal={() => setOpenPermissionsModal(!openPermissionsModal)}
      />
      <DeleteHubModal
        hub={selectedHub}
        open={openDeleteModal}
        afterSubmit={afterSubmit}
        toggleModal={() => setOpenDeleteModal(!openDeleteModal)}
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
          actionsColumnIndex: 4,
          pageSize: 12,
          pageSizeOptions: [12],
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
          }
        }}
        columns={[
          //Column User avatar
          {
            field: 'id',
            Title: 'Logo',
            sorting: false,
            grouping: false,
            width: '15%',
            render: rowData => (
              <div className={classes.badgeNumberContainer}>
                <img
                  src={!!rowData.logoUrl ? rowData.logoUrl : DefaultHubLogo}
                  className={classes.hubLogo}
                  alt="Hub"
                />
              </div>
            )
          },

          //Column Name
          {
            title: t('views.hub.form.name'),
            field: 'name',
            grouping: false,
            sorting: true,
            defaultSort: 'asc',
            width: '25%',
            render: rowData => (
              <React.Fragment>
                <Tooltip title={rowData.name} aria-label="title">
                  <Typography variant="subtitle1" className={classes.name}>
                    {rowData.name ? rowData.name : ''}
                  </Typography>
                </Tooltip>
              </React.Fragment>
            )
          },
          //Column description
          {
            title: t('views.hub.form.description'),
            field: 'description',
            sorting: false,
            width: '30%',
            render: rowData => (
              <Tooltip title={rowData.description} aria-label="description">
                <Typography variant="subtitle2" className={classes.email}>
                  {rowData.description}
                </Typography>
              </Tooltip>
            )
          },
          //Column partnerType
          {
            title: t('views.hub.list.type'),
            field: 'partnerType',
            sorting: true,
            width: '15%',
            render: rowData => (
              <Tooltip title={showType(rowData.partnerType)} aria-label="role">
                <Typography className={classes.labelStyle} variant="h6">
                  {showType(rowData.partnerType)}
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
            searchPlaceholder: t('views.hub.list.search')
          },
          header: {
            actions: ''
          },
          body: {
            emptyDataSourceMessage: t('views.hub.list.empty')
          }
        }}
        data={loadHubs}
        actions={actionList()}
        title=""
      />
    </div>
  );
};

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(withSnackbar(HubsTable));
