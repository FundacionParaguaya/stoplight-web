import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import familyFaceIcon from '../../../assets/family_face_large.png';
import { shouldShowQuestion } from '../../../utils/conditional-logic';
import { ROLES_NAMES } from '../../../utils/role-utils';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    paddingLeft: '12%',
    paddingRight: '12%',
    position: 'relative',
    marginTop: 5,
    marginBottom: 10
  },
  tabsRoot: {
    '& $div > span': {
      backgroundColor: theme.palette.primary.dark,
      height: 4
    },
    '& $div >.MuiTabs-flexContainer': {
      justifyContent: 'space-between'
    }
  },
  tabRoot: {
    minHeight: 50,
    padding: '5px 15px',
    color: theme.typography.h4.color,
    height: 'auto',
    width: 'auto',
    '&.MuiTab-textColorSecondary.Mui-selected': {
      color: theme.typography.h4.color
    },
    '&.MuiTab-textColorSecondary.MuiTab-fullWidth': {
      borderBottom: `1px solid ${theme.palette.grey.quarter}`
    }
  },
  tabTitle: {
    fontSize: 16,
    fontWeight: 500,
    textTransform: 'none',
    [theme.breakpoints.down('xs')]: {
      fontSize: 14
    }
  },
  label: {
    fontFamily: 'Open Sans',
    fontWeight: 500,
    marginTop: 10,
    margin: '0px 10px 0px 10px'
  },
  answer: {
    fontFamily: 'Open Sans',
    color: 'rgba(0,0,0,0.5)',
    marginLeft: 20
  },
  memberTitle: {
    marginLeft: 10,
    fontWeight: 500
  }
}));

const EconomicDetails = ({
  economicData,
  membersEconomicData,
  topics,
  history,
  questionsPerTopics,
  familyMembers,
  user,
  readOnly
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  let { familyId } = useParams();

  const [value, setValue] = useState(0);
  const [hasDataPerTopic, setHasDataPerTopic] = useState([]);
  const [dataByTopic, setDataByTopic] = useState([]);
  const [membersDataByTopic, setMembersDataByTopic] = useState([]);
  const [draft, setDraft] = useState({
    economicSurveyDataList: [],
    familyData: {
      familyMembersList: []
    }
  });

  const handleChange = (event, value) => {
    setValue(value);
  };

  useEffect(() => {
    let questionByTopic = questionsPerTopics.map(topicQuestions =>
      topicQuestions.filter(question => !question.forFamilyMember)
    );

    let memberQuestionByTopic = [];

    let hasDataPerTopic = Array(topics.length).fill(false);

    !!economicData &&
      topics.length > 0 &&
      economicData.forEach(question => {
        let index = topics.findIndex(t => t === question.topic);
        let questionIndex = questionByTopic[index].findIndex(
          q => q.codeName === question.codeName
        );

        questionByTopic[index][questionIndex] = question;

        hasDataPerTopic[index] = true;
      });

    !!membersEconomicData &&
      topics.length > 0 &&
      membersEconomicData.forEach((member, mIndex) => {
        let memberQuestions = questionsPerTopics.map(topicQuestions =>
          topicQuestions.filter(question => question.forFamilyMember)
        );
        memberQuestionByTopic.push({
          name: member.firstName,
          questions: memberQuestions
        });

        member.economic.forEach(question => {
          let index = topics.findIndex(t => t === question.topic);

          let questionIndex = memberQuestionByTopic[mIndex].questions[
            index
          ].findIndex(q => q.codeName === question.codeName);

          memberQuestionByTopic[mIndex].questions[index][
            questionIndex
          ] = question;

          hasDataPerTopic[index] = true;
        });
      });
    setHasDataPerTopic(hasDataPerTopic);
    setDataByTopic(questionByTopic);
    setMembersDataByTopic(memberQuestionByTopic);
    let familyMembersData = familyMembers.map(member => {
      let memberAnswers =
        !!membersEconomicData &&
        membersEconomicData.find(
          mEconomics => mEconomics.memberIdentifier === member.memberIdentifier
        );
      let memberDraft = !!memberAnswers
        ? memberAnswers.economic.map(question => ({
            key: question.codeName,
            value: question.value,
            multipleValue: question.multipleValue
          }))
        : [];
      member.socioEconomicAnswers = memberDraft;
      return member;
    });

    let economicDraft =
      !!economicData &&
      economicData.map(question => ({
        key: question.codeName,
        value: question.value,
        multipleValue: question.multipleValueArray,
        text: question.text
      }));

    setDraft({
      economicSurveyDataList: economicDraft,
      familyData: {
        familyMembersList: familyMembersData
      }
    });
  }, [economicData, membersEconomicData, topics]);

  const showEditButtons = ({ role }) =>
    (role === ROLES_NAMES.ROLE_APP_ADMIN ||
      role === ROLES_NAMES.ROLE_SURVEY_USER_ADMIN ||
      role === ROLES_NAMES.ROLE_SURVEY_USER) &&
    !readOnly;

  return (
    <React.Fragment>
      <div className={classes.root}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="secondary"
          variant="scrollable"
          scrollButtons="auto"
          classes={{ root: classes.tabsRoot }}
        >
          {topics.map((topic, index) => (
            <Tab
              key={index}
              classes={{ root: classes.tabRoot }}
              label={
                <Typography variant="h6" className={classes.tabTitle}>
                  {topic}
                </Typography>
              }
              value={index}
            />
          ))}
        </Tabs>
        <Grid container style={{ minHeight: 150 }}>
          {showEditButtons(user) && (
            <Grid
              item
              md={12}
              container
              justify="flex-end"
              style={{ height: 30 }}
            >
              <Tooltip title={t('views.solutions.form.editButton')}>
                <IconButton
                  component="span"
                  style={{ paddingTop: 4, color: 'black' }}
                  onClick={() => {
                    history.push(
                      `/family/${familyId}/edit-economic/${topics[
                        value
                      ].replace(/\//g, '%2F')}`
                    );
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          )}
          {hasDataPerTopic[value] ? (
            <React.Fragment>
              {!!dataByTopic[value] &&
                dataByTopic[value].length > 0 &&
                dataByTopic[value].map((answer, index) => {
                  return (
                    <React.Fragment key={index}>
                      {shouldShowQuestion(answer, draft) && (
                        <Grid item md={6} sm={6} xs={12}>
                          <Typography variant="h6" className={classes.label}>
                            {answer.questionText}
                          </Typography>
                          {!!answer.text && (
                            <Typography variant="h6" className={classes.answer}>
                              {answer.text}
                            </Typography>
                          )}
                          {!!answer.multipleTextArray && (
                            <ul>
                              {answer.multipleTextArray.map((answer, index) => (
                                <Grid key={index}>
                                  <Typography
                                    variant="h6"
                                    className={classes.answer}
                                  >
                                    <li>{answer}</li>
                                  </Typography>
                                </Grid>
                              ))}
                            </ul>
                          )}
                        </Grid>
                      )}
                    </React.Fragment>
                  );
                })}

              {!!membersDataByTopic &&
                membersDataByTopic.length > 0 &&
                membersDataByTopic.map(
                  (member, mIndex) =>
                    !!member.questions[value] &&
                    member.questions[value].length > 0 && (
                      <React.Fragment key={mIndex}>
                        <Grid
                          item
                          container
                          md={12}
                          sm={12}
                          xs={12}
                          alignItems="center"
                          style={{ marginTop: 15 }}
                        >
                          <img
                            alt=""
                            height={30}
                            width={30}
                            style={{ marginLeft: 10 }}
                            src={familyFaceIcon}
                          />
                          <Typography
                            variant="h6"
                            className={classes.memberTitle}
                          >
                            {member.name}
                          </Typography>
                        </Grid>
                        {member.questions[value].map((answer, index) => {
                          return (
                            <React.Fragment key={index}>
                              {shouldShowQuestion(answer, draft, mIndex) && (
                                <Grid key={index} item md={6} sm={6} xs={12}>
                                  <Typography
                                    variant="h6"
                                    className={classes.label}
                                  >
                                    {answer.questionText}
                                  </Typography>
                                  {!!answer.text && (
                                    <Typography
                                      variant="h6"
                                      className={classes.answer}
                                    >
                                      {answer.text}
                                    </Typography>
                                  )}
                                  {!!answer.multipleTextArray && (
                                    <ul>
                                      {answer.multipleTextArray.map(
                                        (answer, index) => (
                                          <Grid key={index}>
                                            <Typography
                                              variant="h6"
                                              className={classes.answer}
                                            >
                                              <li>{answer}</li>
                                            </Typography>
                                          </Grid>
                                        )
                                      )}
                                    </ul>
                                  )}
                                </Grid>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </React.Fragment>
                    )
                )}
            </React.Fragment>
          ) : (
            <Grid
              container
              justify="center"
              alignItems="center"
              style={{ height: 150 }}
            >
              <Typography variant="h6" className={classes.memberTitle}>
                {t('views.familyProfile.noDataInTopic')}
              </Typography>
            </Grid>
          )}
        </Grid>
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = ({ user }) => ({
  user
});

export default connect(mapStateToProps)(EconomicDetails);
