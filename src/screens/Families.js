import React, { Component, useState } from 'react';
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

const Families = ({ classes, user, t, i18n: { language } }) => {
  //export class Families extends Component {
  const [loading, setLoading] = useState(false);
  const [selectedOrganizations, setSelectedOrganizations] = useState([]);
  const [draftsNumber, setDraftsNumber] = useState(0);
  const [height, setHeight] = React.useState('unset');

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

        <FamilyFilter
          organizationsData={selectedOrganizations}
          onChangeOrganization={setSelectedOrganizations}
        />
        <div
          className={classes.mainContainer}
          style={{ height, maxHeight: height }}
        >
          <FamilyTable
            //handleClickOnSnapshot={this.handleClickOnSnapshot}
            setDraftsNumber={setDraftsNumber}
            setDraftsLoading={setLoading}
          />
        </div>
      </Container>
      <BottomSpacer />
    </div>
  );
};

const styles = theme => ({
  mainContainer: {
    //backgroundColor: '#fff',
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
    )(withTranslation()(withLayout(Families)))
  )
);
