import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { withRouter, useParams } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import { updateUser, updateSurvey, updateDraft } from '../redux/actions';
import Container from '../components/Container';
import chooseLifeMap from '../assets/family.png';
import BottomSpacer from '../components/BottomSpacer';
import withLayout from '../components/withLayout';
import { getFamily } from '../api';
import { withSnackbar } from 'notistack';
import * as _ from 'lodash';

const FamilyProfile = ({
  classes,
  user,
  t,
  i18n: { language },
  enqueueSnackbar
}) => {
  //export class FamilyProfile extends Component {
  const [family, setFamily] = useState({});
  const [firtsParticipant, setFirtsParticipant] = useState(null);
  let { familyId } = useParams();

  useEffect(() => {
    getFamily(familyId, user).then(response => {
      const firtsParticipantMap = _.get(
        response,
        'data.data.familyMemberDTOList',
        []
      ).filter(function(obj) {
        return obj.firtsParticipant;
      });

      setFamily(response.data.data.familyById);
      setFirtsParticipant(firtsParticipantMap);
      console.log('response', family);
    });
  }, []);

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
            <Typography variant="h4">{family.name}</Typography>
            <div className={classes.container}>
              <Typography variant="subtitle2" className={classes.label}>
                {t('views.familyProfile.organization')}:
              </Typography>
              <Typography variant="subtitle1" className={classes.label}>
                {family.organization ? family.organization.name : ''}
              </Typography>
            </div>
          </div>
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
  },
  label: { marginRight: 10, fontSize: 14 },
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center'
  }
});

const mapStateToProps = ({ user }) => ({ user });

const mapDispatchToProps = { updateUser, updateSurvey, updateDraft };

export default withRouter(
  withStyles(styles)(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(withTranslation()(withLayout(withSnackbar(FamilyProfile))))
  )
);
