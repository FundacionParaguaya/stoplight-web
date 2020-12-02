import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import TitleBar from '../../components/TitleBar';
import skippedQuestions from '../../assets/skipped_questions.png';
import { updateDraft } from '../../redux/actions';
import Container from '../../components/Container';
import FooterPopup from '../../components/FooterPopup';

export class SkippedQuestions extends Component {
  state = {
    showFooterPopup: true
  };

  handleButtonClick = () => {
    this.setState({
      showFooterPopup: false
    });
  };

  goToQuestion = e => {
    const { currentSurvey } = this.props;
    currentSurvey.surveyStoplightQuestions.forEach((ele, index) => {
      if (e.key === ele.codeName) {
        this.props.history.push({
          pathname: `/lifemap/stoplight/${index}`,
          state: { skippedReturn: true }
        });
      }
    });
  };

  render() {
    const { t, classes, currentDraft, currentSurvey } = this.props;
    let groupedAnswers;
    const userAnswers = [];
    if (currentSurvey) {
      currentSurvey.surveyStoplightQuestions.forEach(e => {
        currentDraft.indicatorSurveyDataList.forEach(ele => {
          if (e.codeName === ele.key && ele.value === 0) {
            userAnswers.push({
              value: ele.value,
              questionText: e.questionText,
              dimension: e.dimension,
              key: ele.key
            });
          }
        });
      });

      groupedAnswers = userAnswers.reduce((r, a) => {
        // eslint-disable-next-line no-param-reassign
        r[a.dimension] = r[a.dimension] || [];
        r[a.dimension].push(a);
        return r;
      }, {});
    }
    return (
      <div>
        <TitleBar
          // do not delete uniqueBack for now, we are probably going to use that in the future
          //   uniqueBack={() =>
          //     this.props.history.push(`/lifemap/stoplight/${finalQuestion}`)
          //   }
          title={t('views.skippedIndicators')}
        />
        <Container variant="slim" className={classes.container}>
          <img
            className={classes.skippedQuestionsImg}
            src={skippedQuestions}
            alt=""
          />
          {Object.keys(groupedAnswers).map(elem => {
            return (
              <div className={classes.SkippedQuestionsContainer} key={elem}>
                {/* <h1>{elem}</h1> */}
                {groupedAnswers[elem].map(e => {
                  return (
                    <div
                      onClick={() => this.goToQuestion(e)}
                      key={e.key}
                      className={classes.overviewAnswers}
                    >
                      <Typography>{e.questionText}</Typography>
                      <i className={`material-icons ${classes.icon}`}>
                        keyboard_arrow_right
                      </i>
                    </div>
                  );
                })}
              </div>
            );
          })}
          <div className={classes.buttonContainer}>
            {!this.state.showFooterPopup && (
              <Button
                variant="contained"
                onClick={() => this.props.history.push('/lifemap/overview')}
                color="primary"
              >
                {t('general.continue')}
              </Button>
            )}
          </div>
        </Container>
        <FooterPopup
          title={t('views.lifemap.youSkipped')}
          description={t('views.lifemap.whyNotTryAgain')}
          isOpen={this.state.showFooterPopup}
          handleButtonClick={this.handleButtonClick}
        />
      </div>
    );
  }
}

const styles = theme => ({
  skippedQuestionsImg: {
    width: 350,
    marginTop: 40,
    marginBottom: 30,
    alignSelf: 'center',
    [theme.breakpoints.down('500')]: {
      width: 285
    },
    [theme.breakpoints.down('400')]: {
      width: 185,
      height: 125
    }
  },
  container: {
    marginTop: 10,
    display: 'flex',
    flexDirection: 'column',
    // alignItems: 'center',
    justifyContent: 'center'
  },
  titleAndIconContainerPolicy: {
    backgroundColor: '#faefe1',
    display: 'flex',
    padding: '10px 40px 10px 10px',
    alignItems: 'center'
  },
  titleMainAll: {
    margin: 'auto'
  },
  overviewAnswers: {
    cursor: 'pointer',
    width: '100%',
    paddingTop: 35,
    paddingBottom: 35,
    borderBottom: `1px solid ${theme.palette.grey.main}`,
    display: 'flex',
    justifyContent: 'space-between'
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    margin: theme.shape.marginButton
  },
  icon: {
    fontSize: 24,
    color: theme.palette.grey.main,
    marginRight: 35
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
  )(withTranslation()(SkippedQuestions))
);
