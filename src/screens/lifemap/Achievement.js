import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import CircularProgress from '@material-ui/core/CircularProgress';
import Form from '../../components/Form';
import Input from '../../components/Input';
import { updateDraft } from '../../redux/actions';
import TitleBar from '../../components/TitleBar';
import BottomSpacer from '../../components/BottomSpacer';
import Container from '../../components/Container';
import iconAch from '../../assets/imgAch.png';
import { COLORS } from '../../theme';

class Achievements extends Component {
  achievement = this.props.currentDraft.achievements.find(
    item => item.indicator === this.props.match.params.indicator
  );

  state = {
    imageStatus: 'loading',
    question: this.props.currentSurvey.surveyStoplightQuestions.find(
      indicator => indicator.codeName === this.props.match.params.indicator
    ),
    roadmap: (this.achievement && this.achievement.roadmap) || '',
    action: (this.achievement && this.achievement.action) || ''
  };

  handleImageLoaded = () => {
    this.setState({ imageStatus: 'loaded' });
  };

  updateAnswer = (field, value) => {
    this.setState({
      [field]: value
    });
  };

  saveAchievement = () => {
    const { currentDraft } = this.props;
    const { question, roadmap, action } = this.state;

    const achievement = {
      roadmap,
      action,
      indicator: question.codeName
    };

    const item = currentDraft.achievements.filter(
      i => i.indicator === question.codeName
    )[0];

    // If item exists update it
    if (item) {
      const index = currentDraft.achievements.indexOf(item);
      this.props.updateDraft({
        ...currentDraft,
        achievements: [
          ...currentDraft.achievements.slice(0, index),
          achievement,
          ...currentDraft.achievements.slice(index + 1)
        ]
      });
    } else {
      // If item does not exist create it
      this.props.updateDraft({
        ...currentDraft,
        achievements: [...currentDraft.achievements, achievement]
      });
    }
    this.props.history.goBack();
  };

  render() {
    const { t, currentDraft, classes } = this.props;
    const { question } = this.state;
    let color;
    let textColor = 'white';
    const stoplightAnswer = currentDraft.indicatorSurveyDataList.find(
      answers => answers.key === question.codeName
    );
    const stoplightColor = question.stoplightColors.find(
      e => e.value === stoplightAnswer.value
    );
    const { url, description, value: stoplightColorValue } = stoplightColor;
    if (stoplightColorValue === 3) {
      color = COLORS.GREEN;
    } else if (stoplightColorValue === 2) {
      color = COLORS.YELLOW;
      textColor = 'black';
    } else if (stoplightColorValue === 1) {
      color = COLORS.RED;
    }

    return (
      <div>
        <TitleBar
          title={question && question.dimension}
          extraTitleText={question && question.questionText}
        />
        <React.Fragment>
          <div className={classes.imgAndDescriptionContainer}>
            <div
              className={classes.imageContainer}
              style={{ backgroundColor: color }}
            >
              <React.Fragment>
                {this.state.imageStatus === 'loading' && (
                  <div className={classes.loadingContainer}>
                    <div className={classes.loadingIndicatorCenter}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        {' '}
                        <CircularProgress
                          color="inherit"
                          className={classes.circularProgress}
                        />
                      </div>
                      <img
                        onLoad={this.handleImageLoaded}
                        style={{ display: 'none' }}
                        src={url}
                      />
                    </div>
                  </div>
                )}
                {this.state.imageStatus !== 'loading' && (
                  <img className={classes.imgClass} src={url} alt="surveyImg" />
                )}
              </React.Fragment>
            </div>
            <div className={classes.answeredQuestion}>
              <i
                style={{
                  backgroundColor: color
                }}
                className={`${classes.icon} material-icons`}
              >
                done
              </i>
            </div>
            <div
              className={classes.paragraphContainer}
              style={{ backgroundColor: color }}
            >
              <div className={classes.editContainer}>
                <EditIcon className={classes.editIcon} />
              </div>
              <Typography
                variant="body2"
                align="center"
                paragraph
                className={classes.paragraphTypography}
                style={{ color: textColor }}
              >
                {description}
              </Typography>
            </div>
          </div>

          <div className={classes.pinAndPriority}>
            <img style={{ height: 55 }} src={iconAch} alt="icon" />
            <Typography
              variant="h5"
              align="center"
              style={{ marginTop: '10px' }}
            >
              {t('views.lifemap.markAchievement')}
            </Typography>
          </div>
          <Container variant="slim">
            <Form
              onSubmit={this.saveAchievement}
              submitLabel={t('general.save')}
            >
              <Input
                required
                label={t('views.lifemap.howDidYouGetIt')}
                value={this.state.action}
                field="action"
                onChange={this.updateAnswer}
                multiline
              />
              <Input
                label={t('views.lifemap.whatDidItTakeToAchieveThis')}
                value={this.state.roadmap}
                field="roadmap"
                onChange={this.updateAnswer}
                multiline
              />
            </Form>
          </Container>
          <BottomSpacer />
        </React.Fragment>
      </div>
    );
  }
}

const mapStateToProps = ({ currentSurvey, currentDraft }) => ({
  currentSurvey,
  currentDraft
});
const mapDispatchToProps = { updateDraft };
const styles = {
  imageContainer: { display: 'flex', position: 'inherit', width: '100%' },
  loadingContainer: { position: 'absolute', top: '50%', left: '50%' },
  circularProgress: { color: 'white' },
  icon: {
    color: 'white',
    fontSize: 39,
    height: 80,
    width: 80,
    margin: 'auto',
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingIndicatorCenter: {
    left: -20,
    bottom: -20,
    position: 'absolute'
  },
  editContainer: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    display: 'none' // TODO Hidding edit button, feature not implemented yet
  },
  editIcon: {
    fontSize: 24,
    color: 'white'
  },
  answeredQuestion: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    zIndex: 1
  },
  pinAndPriority: {
    marginTop: '40px',
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  imgClass: {
    width: '100%',
    height: '307px',
    minHeight: '100%',
    objectFit: 'cover'
  },
  paragraphContainer: {
    margin: '0px',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    minHeight: '307px'
  },
  paragraphTypography: {
    fontSize: 16,
    zIndex: 1,
    padding: '30px 30px 30px 40px',
    marginBottom: 0
  },
  imgAndDescriptionContainer: {
    position: 'relative',
    display: 'flex',
    width: '614px',
    margin: 'auto',
    marginTop: '30px'
  },
  buttonContainerForm: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 40
  },
  input: {
    marginTop: 10,
    marginBottom: 10
  },
  inputFilled: {
    '& $div': {
      backgroundColor: '#fff!important'
    }
  }
};
export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withTranslation()(Achievements))
);
