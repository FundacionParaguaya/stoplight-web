import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withTranslation } from 'react-i18next';
import { Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { updateUser, updateSurvey, updateDraft } from '../redux/actions';
import Container from '../components/Container';
import chooseLifeMap from '../assets/family.png';
import BottomSpacer from '../components/BottomSpacer';
import { getDateFormatByLocale } from '../utils/date-utils';
import { CONDITION_TYPES } from '../utils/conditional-logic';
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
  const [loading, setLoading] = useState(false);
  const [selectedOrganizations, setOrganizations] = useState([]);
  const [height, setHeight] = React.useState('unset');
  const [families, setFamilies] = useState([]);

  const setSelectedOrganizations = (selected, allOrganizations) => {
    if (selected.some(org => org.value === 'ALL')) {
      setOrganizations(allOrganizations);
    } else {
      setOrganizations(selected);
    }
  };

  const loadFamilies = () => {
    //TODO send information about pagination, family name and organizations
    getFamiliesList(user, 1, null, null)
      .then(response => {
        setFamilies(response.data.content);
      })
      .catch(function(error) {
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

  // Clearing selected organizations when the hub filter changes
  useEffect(() => {
    loadFamilies();
    setSelectedOrganizations([]);
  }, []);

  //Load Grid
  useEffect(() => {
    //Load Families
  }, [selectedOrganizations]);

  return (
    <div className={classes.mainSurveyContainerBoss}>
      <Container>
        <div className={classes.titleContainer}>
          <div className={classes.surveyTopTitle}>
            <Typography variant="h4">
              {t('views.toolbar.households')}
            </Typography>
          </div>
          <img
            src={chooseLifeMap}
            alt="Choose Life Map"
            className={classes.chooseLifeMapImage}
          />
        </div>

        <div>
          <FamilyFilter
            organizationsData={selectedOrganizations}
            onChangeOrganization={setSelectedOrganizations}
          />
        </div>
        <div
          className={classes.mainContainer}
          style={{ height, maxHeight: height }}
        >
          <FamilyTable
            setFamilies={setFamilies}
            families={families}
            loadFamilies={loadFamilies}
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
    padding: theme.spacing(2),
    width: '100%'
  },
  chooseLifeMapImage: {
    display: 'block',
    height: 240,
    right: 30,
    position: 'absolute',
    top: 20
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
