import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getHubsPaginated } from '../api';
import hubBanner from '../assets/hub.png';
import BottomSpacer from '../components/BottomSpacer';
import Container from '../components/Container';
import withLayout from '../components/withLayout';
import HubFormModal from './hubs/HubFormModal';
import HubsSearchFilter from './hubs/HubSearchFilter';
import HubsTable from './hubs/HubsTable';

const useStyles = makeStyles(theme => ({
  mainContainer: {
    backgroundColor: theme.palette.background.paper
  },
  titleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative',
    height: 175
  },
  hubTitle: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    height: 180
  },
  hubImage: {
    display: 'block',
    height: 175,
    right: -60,
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
}));

const Hubs = ({ user, history }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const tableRef = useRef();

  const [resetPagination, setResetPagination] = useState(false);
  const [totalRows, setTotalRow] = useState(0);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState('');
  const [openFormModal, setOpenFormModal] = useState(false);
  const [selectedHub, setSelectedHub] = useState({});

  useEffect(() => {
    if (
      tableRef.current &&
      !tableRef.current.props.isLoading &&
      tableRef.current.onQueryChange
    ) {
      setResetPagination(true);
      tableRef.current.onQueryChange();
    }
  }, [filter]);

  const loadHubs = query => {
    let page = query.page + 1;

    const sortBy = query && query.orderBy ? query.orderBy.field : '';

    const orderDirection = query ? query.orderDirection : '';

    if (resetPagination) {
      page = 1;
      setResetPagination(false);
    }

    setLoading(true);
    return getHubsPaginated(user, page, filter, sortBy, orderDirection)
      .then(response => {
        let totalRecords = response.data.totalRecords;

        setTotalRow(totalRecords);
        return {
          data: response.data.list,
          page: page - 1,
          totalCount: totalRecords
        };
      })
      .finally(() => setLoading(false));
  };

  const onChangeHubFilter = e => {
    if (e.key === 'Enter') {
      setFilter(e.target.value);
    }
  };

  const toggleFormModal = hub => {
    setSelectedHub(hub);
    setOpenFormModal(!openFormModal);
  };

  const afterSubmit = () => {
    tableRef.current.onQueryChange();
  };

  return (
    <div className={classes.mainContainer}>
      <HubFormModal
        hub={selectedHub}
        open={openFormModal}
        afterSubmit={afterSubmit}
        toggleModal={() => setOpenFormModal(!openFormModal)}
      />
      <Container variant="stretch">
        <div className={classes.titleContainer}>
          <div className={classes.hubTitle}>
            <Typography variant="h4">{t('views.toolbar.hubs')}</Typography>
          </div>
          <img src={hubBanner} alt="Hub" className={classes.hubImage} />
        </div>

        <Container
          variant="fluid"
          className={classes.listContainer}
          style={{
            height: React.useState('unset'),
            maxHeight: React.useState('unset')
          }}
        >
          <Grid container justify="space-between">
            <Grid item md={8} sm={8} xs={12}>
              <HubsSearchFilter onChangeHubFilter={onChangeHubFilter} />
            </Grid>
            <Grid item md={4} sm={4} xs={12} container justify="flex-end">
              <Button
                variant="contained"
                onClick={() => {
                  toggleFormModal({});
                }}
              >
                {t('views.hub.addAHub')}
              </Button>
            </Grid>
          </Grid>

          <HubsTable
            loading={loading}
            tableRef={tableRef}
            loadHubs={loadHubs}
            numberOfRows={totalRows}
            toggleFormModal={toggleFormModal}
            history={history}
          />
        </Container>
        <BottomSpacer />
      </Container>
    </div>
  );
};

const mapStateToProps = ({ user }) => ({ user });

export default withRouter(connect(mapStateToProps)(withLayout(Hubs)));
