import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import InputWithFormik from '../../components/InputWithFormik';
import { updateDraft } from '../../redux/actions';
import TitleBar from '../../components/TitleBar';
import BottomSpacer from '../../components/BottomSpacer';
import Container from '../../components/Container';
import iconAch from '../../assets/imgAch.png';
import { COLORS } from '../../theme';

const fieldIsRequired = 'validation.fieldIsRequired';

const validationSchema = Yup.object().shape({
  action: Yup.string().required(fieldIsRequired)
});

class Achievements extends Component {
  achievement = this.props.currentDraft.achievements.find(
    item => item.indicator === this.props.match.params.indicator
  );

  state = {
    imageStatus: 'loading',
    question: this.props.currentSurvey.surveyStoplightQuestions.find(
      indicator => indicator.codeName === this.props.match.params.indicator
    )
  };

  handleImageLoaded = () => {
    this.setState({ imageStatus: 'loaded' });
  };

  saveAchievement = ({ roadmap, action }) => {
    const { currentDraft } = this.props;
    const { question } = this.state;

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
          progressBar={false}
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
                        alt=""
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
            <Formik
              initialValues={{
                action: (this.achievement && this.achievement.action) || '',
                roadmap: (this.achievement && this.achievement.roadmap) || ''
              }}
              validationSchema={validationSchema}
              onSubmit={(values, { setSubmitting }) => {
                this.saveAchievement(values);
                setSubmitting(false);
              }}
            >
              {({ isSubmitting }) => (
                <Form noValidate>
                  <InputWithFormik
                    label={t('views.lifemap.howDidYouGetIt')}
                    name="action"
                    required
                  />
                  <InputWithFormik
                    label={t('views.lifemap.whatDidItTakeToAchieveThis')}
                    name="roadmap"
                  />
                  <div className={classes.buttonContainerForm}>
                    <Button
                      type="submit"
                      color="primary"
                      variant="contained"
                      disabled={isSubmitting}
                    >
                      {t('general.save')}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
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
  }
};
export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withTranslation()(Achievements))
);
