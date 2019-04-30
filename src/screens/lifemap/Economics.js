import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import { updateDraft } from '../../redux/actions';
import TitleBar from '../../components/TitleBar';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Container from '../../components/Container';
import Form from '../../components/Form';
import BottomSpacer from '../../components/BottomSpacer';

export class Economics extends Component {
  state = {
    questions: null,
    topic: ''
  };

  handleContinue = () => {
    // validation happens here

    const currentEconomicsPage = this.props.match.params.page;

    if (
      currentEconomicsPage <
      this.props.currentSurvey.economicScreens.questionsPerScreen.length - 1
    ) {
      this.props.history.push(
        `/lifemap/economics/${parseInt(currentEconomicsPage, 10) + 1}`
      );
    } else {
      this.props.history.push('/lifemap/begin-stoplight');
    }
  };

  setCurrentScreen() {
    const questions = this.props.currentSurvey.economicScreens
      .questionsPerScreen[this.props.match.params.page];

    this.setState({
      questions,
      topic: questions.forFamily.length
        ? questions.forFamily[0].topic
        : questions.forFamilyMember[0].topic
    });
  }

  updateFamilyMember = (codeName, value, question, familyName) => {
    const { currentDraft } = this.props;
    const FamilyMembersDataList = this.props.currentDraft.familyData
      .familyMembersList;
    let update = false;
    // CHECK IF THE QUESTION IS ALREADY IN THE DATA LIST and if it is the set update to true and edit the answer
    FamilyMembersDataList.forEach(e => {
      if (e.firstName === familyName) {
        // eslint-disable-next-line no-shadow
        e.socioEconomicAnswers.forEach(e => {
          if (e.key === question.codeName) {
            update = true;
            e.value = value;
          }
        });
      }
    });
    if (update) {
      const familyMembersList = FamilyMembersDataList;
      this.props.updateDraft({
        ...currentDraft,
        familyData: {
          ...currentDraft.familyData,
          familyMembersList
        }
      });
    } else {
      const familyMembersList = FamilyMembersDataList;
      FamilyMembersDataList.forEach(e => {
        if (e.firstName === familyName) {
          e.socioEconomicAnswers.push({
            key: question.codeName,
            value
          });
        }
      });
      // add the question to the data list if it doesnt exist
      this.props.updateDraft({
        ...currentDraft,
        familyData: {
          ...currentDraft.familyData,
          familyMembersList
        }
      });
    }
  };

  setFamilyMemberName = e => {
    // eslint-disable-next-line no-console
    console.log(e);
  };

  updateDraft = (codeName, value) => {
    const { currentDraft } = this.props;
    const dataList = this.props.currentDraft.economicSurveyDataList;
    let update = false;
    // ////////////// CHECK IF THE QUESTION IS ALREADY IN THE DATA LIST and if it is the set update to true and edit the answer
    dataList.forEach(e => {
      if (e.key === codeName) {
        update = true;
        e.value = value;
      }
    });

    // /////////if the question is in the data list then update the question
    if (update) {
      const economicSurveyDataList = dataList;
      this.props.updateDraft({
        ...currentDraft,
        economicSurveyDataList
      });
    } else {
      // ////////// add the question to the data list if it doesnt exist
      this.props.updateDraft({
        ...currentDraft,
        economicSurveyDataList: [
          ...currentDraft.economicSurveyDataList,
          {
            key: codeName,
            value
          }
        ]
      });
    }
  };

  componentDidMount() {
    this.setCurrentScreen();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.page !== this.props.match.params.page) {
      this.setCurrentScreen();
    }
  }

  render() {
    const { questions, topic } = this.state;
    const { t, currentDraft, classes } = this.props;
    return (
      <div>
        <TitleBar title={topic} />
        <Container variant="slim">
          <Form
            onSubmit={this.handleContinue}
            submitLabel={t('general.continue')}
          >
            <React.Fragment>
              {/* List of questions for current topic */}

              {questions &&
                questions.forFamily.map(question => {
                  let selectValue;
                  currentDraft.economicSurveyDataList.forEach(e => {
                    if (e.key === question.codeName) {
                      selectValue = e.value;
                    }
                  });
                  if (question.answerType === 'select') {
                    return (
                      <Select
                        key={question.codeName}
                        label={question.questionText}
                        value={selectValue}
                        options={question.options}
                        field={question.codeName}
                        onChange={this.updateDraft}
                      />
                    );
                  }
                  return (
                    <Input
                      key={question.codeName}
                      required={question.required}
                      label={question.questionText}
                      value={selectValue}
                      field={question.codeName}
                      onChange={this.updateDraft}
                    />
                  );
                })}

              {questions &&
              this.props.match.params.page === '1' &&
              questions.forFamilyMember.length ? (
                <React.Fragment>
                  {currentDraft.familyData.familyMembersList
                    .filter(familyMember => !familyMember.firstParticipant)
                    .map((familyMember, index) => {
                      // console.log(familyMember, index)
                      return (
                        <React.Fragment key={familyMember.firstName}>
                          <div className={classes.familyMemberNameLarge}>
                            <Typography
                              style={{
                                marginTop: '20px',
                                marginBottom: '16px'
                              }}
                              variant="h6"
                            >
                              <span className={classes.familyMemberTitle}>
                                <i
                                  className={`material-icons ${
                                    classes.familyMemberIcon
                                  }`}
                                >
                                  face
                                </i>
                                {familyMember.firstName}
                              </span>
                            </Typography>
                          </div>

                          <React.Fragment>
                            {' '}
                            {questions &&
                              questions.forFamilyMember.map(question => {
                                let selectValue;

                                currentDraft.familyData.familyMembersList[
                                  index
                                ].socioEconomicAnswers.forEach(ele => {
                                  if (ele.key === question.codeName) {
                                    selectValue = ele.value;
                                  }
                                });

                                if (question.answerType === 'select') {
                                  return (
                                    <Select
                                      key={question.codeName}
                                      label={question.questionText}
                                      value={selectValue}
                                      options={question.options}
                                      field={question.codeName}
                                      onChange={(event, child) =>
                                        this.updateFamilyMember(
                                          event,
                                          child,
                                          question,
                                          familyMember.firstName
                                        )
                                      }
                                    />
                                  );
                                }
                                return (
                                  <Input
                                    key={question.codeName}
                                    required={question.required}
                                    label={question.questionText}
                                    value={selectValue}
                                    field={question.codeName}
                                    onChange={(event, child) =>
                                      this.updateFamilyMember(
                                        event,
                                        child,
                                        question,
                                        familyMember.firstName
                                      )
                                    }
                                  />
                                );
                              })}
                          </React.Fragment>
                        </React.Fragment>
                      );
                    })}
                </React.Fragment>
              ) : null}
            </React.Fragment>
          </Form>
        </Container>
        <BottomSpacer />
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
  familyMemberNameLarge: {
    marginTop: '15px',
    marginBottom: '-10px',
    fontSize: '23px'
  },
  familyMemberTitle: {
    display: 'flex',
    alignItems: 'center'
  },
  familyMemberIcon: {
    marginRight: 7,
    fontSize: 35,
    color: '#909090'
  }
};
export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withTranslation()(Economics))
);
