import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import { getUsersPaginated } from '../api';
import Container from '../components/Container';
import withLayout from '../components/withLayout';
import userBanner from '../assets/user_banner.png';
import UserFilters from './users/UserFilters';
import UserFormModal from './users/UserFormModal';
import UsersTable from './users/UsersTable';
import BottomSpacer from '../components/BottomSpacer';

const styles = theme => ({
  mainContainer: {
    backgroundColor: theme.palette.background.paper
  },
  titleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative',
    height: 240
  },
  userTitle: {
    color: theme.palette.primary.dark,
    fontSize: '18px',
    marginRight: 'auto',
    marginBottom: 7,
    fontWeight: theme.typography.fontWeightMedium,
    lineHeight: 1.2,
    paddingTop: 100
  },
  userImage: {
    display: 'block',
    height: 240,
    right: -70,
    position: 'absolute',
    top: -10,
    zIndex: 0,
    objectFit: 'cover',
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    }
  },
  listContainer: {
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  }
});

const Users = ({ classes, t, user }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState();
  const [filter, setFilter] = useState('');
  const [hub, setHub] = useState({});
  const [orgs, setOrgs] = useState([]);
  const tableRef = useRef();
  const [resetPagination, setResetPagination] = useState(false);
  const [totalRows, setTotalRow] = useState(0);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (
      tableRef.current &&
      !tableRef.current.props.isLoading &&
      tableRef.current.onQueryChange
    ) {
      setResetPagination(true);
      tableRef.current.onQueryChange();
    }
  }, [filter, orgs, hub]);

  const loadUsers = query => {
    setLoading(true);
    let page = query ? query.page : 0;
    const orderDirection = query ? query.orderDirection : '';
    const sortBy = query && query.orderBy ? query.orderBy.field : '';

    if (resetPagination) {
      page = 0;
      setResetPagination(false);
    }

    let hubs = !!hub && !!hub.value ? [hub] : [];

    let orgsIds = [];

    if (!orgs.some(org => org.value === 'ALL')) {
      orgsIds = (orgs || []).map(o => o.value);
    }

    return getUsersPaginated(
      user,
      page,
      filter,
      orgsIds,
      hubs.map(h => h.value),
      sortBy,
      orderDirection
    )
      .then(response => {
        setUsers(response.data.data.searchUsers.content);
        setTotalRow(response.data.data.searchUsers.totalElements);
        return {
          data: response.data.data.searchUsers.content,
          page: page,
          totalCount: response.data.data.searchUsers.totalElements
        };
      })
      .finally(() => setLoading(false));
  };

  const onChangeUserFilter = e => {
    if (e.key === 'Enter') {
      setFilter(e.target.value);
    }
  };

  const onChangeHub = hub => {
    setHub(hub);
    setOrgs([]);
  };

  const toggleFormModal = user => {
    setSelectedUser(user);
    setOpenFormModal(!openFormModal);
  };

  const afterSubmit = () => {
    tableRef.current.onQueryChange();
  };

  return (
    <div className={classes.mainContainer}>
      <UserFormModal
        userId={!!selectedUser && selectedUser.id}
        open={openFormModal}
        afterSubmit={afterSubmit}
        toggleModal={() => {
          setOpenFormModal(!openFormModal);
        }}
      />
      <Container variant="stretch">
        <div className={classes.titleContainer}>
          <div className={classes.userTitle}>
            <Typography variant="h4">{t('views.toolbar.users')}</Typography>
          </div>
          <img
            src={userBanner}
            alt="Choose Life Map"
            className={classes.userImage}
          />
        </div>

        <UserFilters
          hubData={hub}
          organizationsData={orgs}
          onChangeHub={onChangeHub}
          onChangeOrganization={setOrgs}
          onChangeUserFilter={onChangeUserFilter}
          setUserToEdit={setSelectedUser}
          toggleFormModal={toggleFormModal}
        />
        <Container
          variant="fluid"
          className={classes.listContainer}
          style={{
            height: React.useState('unset'),
            maxHeight: React.useState('unset')
          }}
        >
          <UsersTable
            loading={loading}
            tableRef={tableRef}
            setUsers={setUsers}
            users={users}
            loadUsers={loadUsers}
            numberOfRows={totalRows}
            toggleFormModal={toggleFormModal}
          />
        </Container>
        <BottomSpacer />
      </Container>
    </div>
  );
};

const mapStateToProps = ({ user }) => ({ user });

export default withRouter(
  withStyles(styles)(
    connect(mapStateToProps)(withTranslation()(withLayout(Users)))
  )
);
