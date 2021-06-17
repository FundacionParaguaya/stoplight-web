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
import MoveFamilyModal from './families/MoveFamilyModal';
import MergeFamilyModal from './families/MergeFamilyModal';

const Families = ({
  classes,
  user,
  t,
  i18n: { language },
  enqueueSnackbar,
  history
}) => {
  //export class Families extends Component {
  const [didMount, setDidMount] = useState(false);
  const [selectedOrganizations, setOrganizations] = useState([]);
  const [selectedFacilitators, setFacilitators] = useState([]);
  const [selectedHub, setSelectedHub] = useState([]);
  const [selectedFamilyFilter, setFamilyFilter] = useState(null);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const tableRef = useRef();
  const [height] = React.useState('unset');
  const [families, setFamilies] = useState([]);
  const [numberOfRows, setNumberOfRows] = useState(0);
  const [resetPagination, setResetPagination] = useState(false);
  const [openMoveModal, setOpenMoveModal] = useState(false);
  const [openMergeModal, setOpenMergeModal] = useState(false);
  const [selectedFamilies, setSelectedFamilies] = useState([]);

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
    setFacilitators(selected);
  };

  const onChangeFamiliesFilter = e => {
    if (e.key === 'Enter') {
      setFamilyFilter(e.target.value);
      setResetPagination(true);
    }
  };

  const redirectToFamily = (e, familyId) => {
    history.push(`/family/${familyId}`);
  };

  const loadFamilies = query => {
    const hubId = selectedHub && selectedHub.value ? selectedHub.value : null;
    const sanitizedOrganizations = selectedOrganizations.map(
      ({ value }) => value
    );

    const sanitizedFacilitators = selectedFacilitators.map(
      ({ value }) => value
    );

    const sanitizedProjects = (selectedProjects || []).map(
      ({ value }) => value
    );

    let page = query ? query.page : 0;

    if (resetPagination) {
      page = 0;
      setResetPagination(false);
    }

    const orderDirection = query ? query.orderDirection : '';
    const sortBy = query && query.orderBy ? query.orderBy.field : '';

    return getFamiliesList(
      user,
      page,
      sortBy,
      orderDirection,
      selectedFamilyFilter,
      sanitizedOrganizations,
      sanitizedFacilitators,
      hubId,
      sanitizedProjects
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
        console.error(error);
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

  const afterSubmit = () => {
    setSelectedFamilies([]);
    tableRef.current.onQueryChange();
  };

  const toggleMoveModal = families => {
    setSelectedFamilies(families);
    setOpenMoveModal(!openMoveModal);
  };

  const toggleMergeModal = families => {
    setSelectedFamilies(families);
    setOpenMergeModal(!openMergeModal);
  };

  useEffect(() => setDidMount(true), []);

  // Clearing selected organizations when the hub filter changes
  useEffect(() => {
    if (didMount) {
      loadFamilies();
      setSelectedOrganizations([]);
      setSelectedFacilitator([]);
    }
  }, [selectedHub]);

  //Load Grid
  useEffect(() => {
    if (tableRef.current && tableRef.current.onQueryChange && didMount) {
      tableRef.current.onQueryChange();
    }
  }, [
    selectedOrganizations,
    selectedFamilyFilter,
    selectedFacilitators,
    selectedProjects
  ]);

  return (
    <div className={classes.mainSurveyContainerBoss}>
      <MoveFamilyModal
        toggleModal={toggleMoveModal}
        open={openMoveModal}
        selectedFamilies={selectedFamilies}
        afterSubmit={afterSubmit}
        lang={language}
      />
      <MergeFamilyModal
        toggleModal={toggleMergeModal}
        open={openMergeModal}
        selectedFamilies={selectedFamilies}
        afterSubmit={afterSubmit}
        user={user}
      />
      <Container variant="stretch">
        <div className={classes.titleContainer}>
          <div className={classes.surveyTopTitle}>
            <Typography variant="h4">
              {t('views.toolbar.households')}
            </Typography>
            <img
              src={chooseLifeMap}
              alt="Choose Life Map"
              className={classes.chooseLifeMapImage}
            />
          </div>
        </div>

        <div>
          <FamilyFilter
            facilitatorsData={selectedFacilitators}
            organizationsData={selectedOrganizations}
            hubData={selectedHub}
            projectsData={selectedProjects}
            onChangeHub={setSelectedHub}
            onChangeOrganization={setSelectedOrganizations}
            onChangeFamiliesFilter={onChangeFamiliesFilter}
            onChangeFacilitator={setSelectedFacilitator}
            onChangeProjects={setSelectedProjects}
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
            redirectToFamily={redirectToFamily}
            toggleMoveModal={toggleMoveModal}
            toggleMergeModal={toggleMergeModal}
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
    height: 175,
    right: -30,
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
    position: 'relative',
    height: 180
  },
  surveyTopTitle: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    height: 180,
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
