import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import familyFaceIcon from '../../../assets/family_face_large.png';
import { ROLES_NAMES } from '../../../utils/role-utils';
import { connect } from 'react-redux';

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
    textTransform: 'none'
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
    marginLeft: 10
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
  user
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  let { familyId } = useParams();

  const [value, setValue] = useState(0);
  const [hasData, setHasData] = useState(false);
  const [hasDataPerTopic, setHasDataPerTopic] = useState([]);
  const [dataByTopic, setDataByTopic] = useState([]);
  const [membersDataByTopic, setMembersDataByTopic] = useState([]);

  const handleChange = (event, value) => {
    setValue(value);
  };

  useEffect(() => {
    let questionByTopic = [];

    let memberQuestionByTopic = [];

    let hasDataPerTopic = Array(topics.length).fill(false);

    setHasData(
      (!!economicData && economicData.length > 0) ||
        (!!membersEconomicData &&
          membersEconomicData.reduce(
            (r, m) => m.economic.length > 0 || r,
            false
          ))
    );

    !!economicData &&
      economicData.forEach(question => {
        let index = topics.findIndex(t => t === question.topic);

        questionByTopic[index] = !!questionByTopic[index]
          ? [...questionByTopic[index], question]
          : [question];

        hasDataPerTopic[index] = true;
      });

    !!membersEconomicData &&
      membersEconomicData.forEach((member, mIndex) => {
        memberQuestionByTopic.push({ name: member.firstName, questions: [] });

        member.economic.forEach(question => {
          let index = topics.findIndex(t => t === question.topic);

          memberQuestionByTopic[mIndex].questions[
            index
          ] = !!memberQuestionByTopic[mIndex].questions[index]
            ? [...memberQuestionByTopic[mIndex].questions[index], question]
            : [question];

          hasDataPerTopic[index] = true;
        });
      });

    setHasDataPerTopic(hasDataPerTopic);
    setDataByTopic(questionByTopic);
    setMembersDataByTopic(memberQuestionByTopic);
  }, [economicData, membersEconomicData, topics]);

  const showEditButtons = ({ role }) =>
    role === ROLES_NAMES.ROLE_APP_ADMIN ||
    role === ROLES_NAMES.ROLE_SURVEY_USER_ADMIN ||
    role === ROLES_NAMES.ROLE_SURVEY_USER;

  return (
    <React.Fragment>
      {hasData ? (
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
          {hasDataPerTopic[value] ? (
            <React.Fragment>
              <Grid container style={{ minHeight: 150 }}>
                {showEditButtons(user) && (
                  <Grid item md={12} container justify="flex-end">
                    <Tooltip title={t('views.solutions.form.editButton')}>
                      <Button
                        className={classes.actionIcon}
                        onClick={() => {
                          history.push(
                            `/family/${familyId}/edit-economic/${topics[value]}`
                          );
                        }}
                      >
                        <EditIcon />
                      </Button>
                    </Tooltip>
                  </Grid>
                )}
                {!!dataByTopic[value] &&
                  dataByTopic[value].length > 0 &&
                  dataByTopic[value].map((answer, index) => (
                    <Grid key={index} item md={6}>
                      <Typography variant="h6" className={classes.label}>
                        {`${answer.questionText}:`}
                      </Typography>
                      {!!answer.text && (
                        <Typography variant="h6" className={classes.answer}>
                          {answer.text}
                        </Typography>
                      )}
                      {!!answer.multipleTextArray &&
                        answer.multipleTextArray.length > 0 && (
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
                  ))}

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
                          {member.questions[value].map((answer, index) => (
                            <Grid key={index} item md={6}>
                              <Typography
                                variant="h6"
                                className={classes.label}
                              >
                                {`${answer.questionText}:`}
                              </Typography>
                              {!!answer.text && (
                                <Typography
                                  variant="h6"
                                  className={classes.answer}
                                >
                                  {answer.text}
                                </Typography>
                              )}
                              {!!answer.multipleTextArray &&
                                answer.multipleTextArray.length > 0 && (
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
                          ))}
                        </React.Fragment>
                      )
                  )}
              </Grid>
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
        </div>
      ) : (
        <Grid
          container
          justify="center"
          alignItems="center"
          style={{ height: 250 }}
        >
          <Typography variant="h6" className={classes.memberTitle}>
            {t('views.familyProfile.noEconomic')}
          </Typography>
        </Grid>
      )}
    </React.Fragment>
  );
};

const mapStateToProps = ({ user }) => ({
  user
});

export default connect(mapStateToProps)(EconomicDetails);
