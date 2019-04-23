import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Form from '../../components/Form';
import Input from '../../components/Input';
import { updateDraft } from '../../redux/actions';
import TitleBar from '../../components/TitleBar';
import BottomSpacer from '../../components/BottomSpacer';
import Container from '../../components/Container';
import iconProprity from '../../assets/iconPriority.png';

class Priority extends Component {
  priority = this.props.currentDraft.priorities.find(
    item => item.indicator === this.props.match.params.indicator
  );

  state = {
    imageStatus: 'loading',
    question: this.props.currentSurvey.surveyStoplightQuestions.find(
      indicator => indicator.codeName === this.props.match.params.indicator
    ),
    reason: (this.priority && this.priority.reason) || '',
    action: (this.priority && this.priority.action) || '',
    estimatedDate: (this.priority && this.priority.estimatedDate) || 1
  };

  handleImageLoaded = () => {
    this.setState({ imageStatus: 'loaded' });
  };

  updateAnswer = (field, value) => {
    this.setState({
      [field]: field === 'estimatedDate' ? parseInt(value, 10) : value
    });
  };

  savePriority = () => {
    const { currentDraft } = this.props;
    const { question, reason, action, estimatedDate } = this.state;

    const priority = {
      reason,
      action,
      estimatedDate,
      indicator: question.codeName
    };

    const item = currentDraft.priorities.filter(
      i => i.indicator === question.codeName
    )[0];

    // If item exists update it
    if (item) {
      const index = currentDraft.priorities.indexOf(item);
      this.props.updateDraft({
        ...currentDraft,
        priorities: [
          ...currentDraft.priorities.slice(0, index),
          priority,
          ...currentDraft.priorities.slice(index + 1)
        ]
      });
    } else {
      // If item does not exist create it
      this.props.updateDraft({
        ...currentDraft,
        priorities: [...currentDraft.priorities, priority]
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
      color = '#89bd76';
    } else if (stoplightColorValue === 2) {
      color = '#f0cb17';
      textColor = 'black';
    } else if (stoplightColorValue === 1) {
      color = '#e1504d';
    }

    return (
      <div>
        <TitleBar
          title={question && question.dimension}
          extraTitleText={question && question.questionText}
        />
        <React.Fragment>
          <div className={classes.imgAndDescriptionContainer}>
            {this.state.imageStatus === 'loading' ? (
              <React.Fragment>
                <div>
                  {' '}
                  <CircularProgress />
                </div>
                <img
                  onLoad={this.handleImageLoaded}
                  className={classes.imgClass}
                  src={url}
                  alt="surveyImg"
                />
              </React.Fragment>
            ) : (
              <img className={classes.imgClass} src={url} alt="surveyImg" />
            )}
            <div className={classes.answeredQuestion}>
              <i
                style={{
                  color: 'white',
                  backgroundColor: color,
                  fontSize: 39,
                  height: 80,
                  width: 80,
                  margin: 'auto',
                  display: 'flex',
                  borderRadius: '50%',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                className="material-icons"
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
            <img style={{ height: 55 }} src={iconProprity} alt="icon" />
            <Typography
              variant="h5"
              align="center"
              style={{ marginTop: '10px' }}
            >
              {t('views.lifemap.makeThisAPriority')}
            </Typography>
          </div>
          <Container variant="slim">
            <Form
              key={question.codeName}
              onSubmit={this.savePriority}
              submitLabel={t('general.save')}
            >
              <Input
                months
                label={t('views.lifemap.howManyMonthsWillItTake')}
                value={this.state.estimatedDate}
                field="estimatedDate"
                onChange={this.updateAnswer}
              />
              <Input
                label={t('views.lifemap.whyDontYouHaveIt')}
                value={this.state.reason}
                field="reason"
                onChange={this.updateAnswer}
                multiline
              />
              <Input
                label={t('views.lifemap.whatWillYouDoToGetIt')}
                value={this.state.action}
                field="action"
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
    width: '307px'
  },
  paragraphContainer: {
    margin: '0px',
    paddingTop: '48px',
    paddingLeft: '20px',
    paddingRight: '20px',
    display: 'flex',
    alignItems: 'center',
    width: '307px'
  },
  paragraphTypography: {
    fontSize: 16,
    zIndex: 1
  },
  imgAndDescriptionContainer: {
    position: 'relative',
    height: '307px',
    display: 'flex',
    width: '614px',
    margin: 'auto',
    marginTop: '30px'
  }
};
export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withTranslation()(Priority))
);
