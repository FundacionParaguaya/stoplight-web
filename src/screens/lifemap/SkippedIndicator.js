import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { updateDraft } from '../../redux/actions';

import TitleBar from '../../components/TitleBar';
import SkippedImg from '../../assets/skipped.png';
import BottomSpacer from '../../components/BottomSpacer';
import Container from '../../components/Container';

const goToQuestion = (surveyStoplightQuestions, question, history) => {
  surveyStoplightQuestions.forEach((surveyQuestion, index) => {
    if (question.codeName === surveyQuestion.codeName) {
      history.push({
        pathname: `/lifemap/stoplight/${index}`,
        state: { overviewReturn: true }
      });
    }
  });
};

const SkippedIndicator = props => {
  const question = props.currentSurvey.surveyStoplightQuestions.find(
    indicator => indicator.codeName === props.match.params.indicator
  );

  const { t, classes } = props;
  return (
    <div>
      <TitleBar
        title={question.dimension}
        extraTitleText={question.questionText}
        progressBar={false}
      />
      <Container>
        <div className={classes.container}>
          <Typography variant="h5" gutterBottom>
            {t('views.skippedIndicator.subtitle')}
          </Typography>
          <div className={classes.imgContainer}>
            <img
              className={classes.skippedQuestionsImg}
              src={SkippedImg}
              alt=""
            />
          </div>
          <Button
            variant="contained"
            onClick={() =>
              goToQuestion(
                props.currentSurvey.surveyStoplightQuestions,
                question,
                props.history
              )
            }
            color="primary"
          >
            {t('views.skippedIndicator.buttonLabel')}
          </Button>
          <BottomSpacer />
        </div>
      </Container>
    </div>
  );
};

const styles = theme => ({
  skippedQuestionsImg: {
    height: '240px'
  },
  imgContainer: {
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(6)
  },
  container: {
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing(7)
  }
});

const mapStateToProps = ({ currentSurvey, currentDraft }) => ({
  currentSurvey,
  currentDraft
});

const mapDispatchToProps = { updateDraft };

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withTranslation()(SkippedIndicator))
);
