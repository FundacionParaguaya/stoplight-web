import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import { updateUser, updateSurvey, updateDraft } from '../redux/actions';
import Container from '../components/Container';
import chooseLifeMap from '../assets/family.png';
import BottomSpacer from '../components/BottomSpacer';
import withLayout from '../components/withLayout';
import FamilyTable from '../components/FamilyTable';
import FamilyFilter from '../components/FamilyFilter';
import { getFamiliesList } from '../api';
import { withSnackbar } from 'notistack';

const Families = ({
  classes,
  user,
  t,
  i18n: { language },
  enqueueSnackbar
}) => {
  //export class Families extends Component {
  const [selectedOrganizations, setOrganizations] = useState([]);
  const [selectedFacilitators, setFacilitators] = useState([]);
  const [selectedFamilyFilter, setFamilyFilter] = useState(null);
  const tableRef = useRef();
  const [height] = React.useState('unset');
  const [families, setFamilies] = useState([]);
  const [numberOfRows, setNumberOfRows] = useState(0);
  const [resetPagination, setResetPagination] = useState(false);

  const setSelectedOrganizations = (selected, allOrganizations) => {
    setResetPagination(true);
    if (selected.some(org => org.value === 'ALL')) {
      setOrganizations(allOrganizations);
    } else {
      setOrganizations(selected);
    }
  };

  const setSelectedFacilitator = (selected, allFacilitators) => {
    setResetPagination(true);
    console.log('setSelectedFacilitator', selected);
    if (selected.some(org => org.value === 'ALL')) {
      setFacilitators(allFacilitators);
    } else {
      setFacilitators(selected);
    }
  };

  const onChangeFamiliesFilter = e => {
    console.log(e.key);
    if (e.key === 'Enter') {
      console.log('do search');
      setFamilyFilter(e.target.value);
      setResetPagination(true);
    }
  };

  const loadFamilies = query => {
    const sanitizedOrganizations = selectedOrganizations.map(
      ({ value }) => value
    );

    const sanitizedFacilitators = selectedFacilitators.map(
      ({ value }) => value
    );

    let page = query ? query.page : 0;
    console.log('selectedFamilyFilter: ', selectedFamilyFilter);
    if (resetPagination) {
      console.log('reset Pagination: ', resetPagination);
      page = 0;
      setResetPagination(false);
    }
    console.log('Current Page: ', page);

    const orderDirection = query ? query.orderDirection : '';
    const sortBy = query && query.orderBy ? query.orderBy.field : '';

    return getFamiliesList(
      user,
      page,
      sortBy,
      orderDirection,
      selectedFamilyFilter,
      sanitizedOrganizations,
      sanitizedFacilitators
    )
      .then(response => {
        //https://material-table.com/#/docs/features/remote-data

        setNumberOfRows(
          getFormatNumber(response.data.data.families.totalElements + '')
        );
        return {
          data: response.data.data.families.content,
          page: page,
          totalCount: response.data.data.families.totalElements
        };
      })
      .catch(function(error) {
        console.log(error);
        setFamilies([]);
        enqueueSnackbar(t('views.familyList.errorLoadingFamilies'), {
          variant: 'error',
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center'
          }
        });
      });
  };

  const getFormatNumber = total => {
    return total.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  // Clearing selected organizations when the hub filter changes
  useEffect(() => {
    loadFamilies();
    setSelectedOrganizations([]);
    setSelectedFacilitator([]);
  }, []);

  //Load Grid
  useEffect(() => {
    //Load Families
    // loadFamilies();
    if (tableRef.current && tableRef.current.onQueryChange) {
      tableRef.current.onQueryChange();
    }
  }, [selectedOrganizations, selectedFamilyFilter, selectedFacilitators]);

  return (
    <div className={classes.mainSurveyContainerBoss}>
      <Container variant="stretch">
        <div className={classes.titleContainer}>
          <div className={classes.surveyTopTitle}>
            <img
              src={chooseLifeMap}
              alt="Choose Life Map"
              className={classes.chooseLifeMapImage}
            />
            <Typography variant="h4">
              {t('views.toolbar.households')}
            </Typography>
          </div>
        </div>

        <div>
          <FamilyFilter
            facilitatorsData={selectedFacilitators}
            organizationsData={selectedOrganizations}
            onChangeOrganization={setSelectedOrganizations}
            onChangeFamiliesFilter={onChangeFamiliesFilter}
            onChangeFacilitator={setSelectedFacilitator}
            familiesFilter={selectedFamilyFilter}
            setFamiliesFilter={setFamilyFilter}
            setResetPagination={setResetPagination}
          />
        </div>
        <div
          className={classes.mainContainer}
          style={{ height, maxHeight: height }}
        >
          <FamilyTable
            tableRef={tableRef}
            setFamilies={setFamilies}
            families={families}
            loadFamilies={loadFamilies}
            numberOfRows={numberOfRows}
          />
        </div>
      </Container>
      <BottomSpacer />
    </div>
  );
};

const styles = theme => ({
  mainContainer: {
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    //padding: theme.spacing(2),
    width: '100%'
  },
  titleBalls: {
    position: 'relative',
    top: '10%',
    right: '25%',
    width: '90%',
    objectFit: 'cover',
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    }
  },
  chooseLifeMapImage: {
    display: 'block',
    height: 240,
    right: 30,
    position: 'absolute',
    top: -10,
    zIndex: 0,
    objectFit: 'cover',
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    }
  },
  titleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative'
  },
  surveyTopTitle: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    height: 220,
    zIndex: 1
  },
  mainSurveyContainerBoss: {
    backgroundColor: theme.palette.background.paper
  }
});

const mapStateToProps = ({ user }) => ({ user });

const mapDispatchToProps = { updateUser, updateSurvey, updateDraft };

export default withRouter(
  withStyles(styles)(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(withTranslation()(withLayout(withSnackbar(Families))))
  )
);
