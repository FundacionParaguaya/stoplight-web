import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Accordion, AccordionItem } from 'react-sanfona';
import EconomicDetails from './EconomicDetails';
import PersonalDetails from './PersonalDetails';

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: 15,
    padding: '10px 12% 10px 12%',
    backgroundColor: theme.palette.background.default
  },
  readOnlyContainer: {
    padding: 0,
    paddingBottom: 2,
    marginTop: 0,
    marginBottom: 15
  },
  advancedContainer: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    height: 40,
    backgroundColor: theme.palette.background.default,
    cursor: 'pointer',
    marginBottom: 10,
    borderRadius: 2,
    border: `1.5px solid ${theme.palette.grey.quarter}`,
    '&:hover': {
      border: `1.5px solid ${theme.palette.primary.main}`
    }
  },
  advancedLabel: {
    color: theme.palette.primary.dark,
    width: '80%',
    paddingLeft: '20%',
    textAlign: 'center',
    fontSize: 20,
    [theme.breakpoints.down('xs')]: {
      fontSize: 16,
      paddingLeft: '10%'
    }
  },
  expandIcon: {
    color: theme.palette.primary.dark,
    width: '20%'
  },
  item: {
    '& .react-sanfona-item-body': {
      maxHeight: 'none'
    }
  },
  expandedItem: {
    '& .react-sanfona-item-body': {
      maxHeight: 'none!important'
    }
  }
}));

const Details = ({
  primaryParticipant,
  familyMembers,
  latitude,
  longitude,
  economicData,
  membersEconomicData,
  survey,
  history,
  readOnly
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [openFamilyDetails, setOpenFamilyDetails] = useState(false);
  const [openEconomicDetails, setOpenEconomicDetails] = useState(false);
  const [sanitazedFamilyMembers, setSanitazedFamilyMembers] = useState([]);
  const [topics, setTopics] = useState([]);
  const [questionsPerTopics, setQuestionsPerTopic] = useState([]);

  useEffect(() => {
    let cleanfamilyMembers = familyMembers.filter(
      member => !member.firstParticipant && member
    );
    setSanitazedFamilyMembers(cleanfamilyMembers);
  }, [familyMembers]);

  useEffect(() => {
    let currentDimension = '';
    let topicsFounded = [];
    let groupedQuestions = [];

    !!survey &&
      survey.surveyEconomicQuestions.forEach(question => {
        if (question.topic !== currentDimension) {
          currentDimension = question.topic;
          topicsFounded.push(question.topic);
        }
        const index = topicsFounded.length - 1;
        groupedQuestions[index] = !!groupedQuestions[index]
          ? [...groupedQuestions[index], question]
          : [question];
      });

    setTopics(topicsFounded);
    setQuestionsPerTopic(groupedQuestions);
  }, [survey]);

  return (
    <Accordion
      className={clsx(classes.container, readOnly && classes.readOnlyContainer)}
    >
      <AccordionItem
        key={1}
        onExpand={() => setOpenFamilyDetails(!openFamilyDetails)}
        onClose={() => setOpenFamilyDetails(!openFamilyDetails)}
        title={
          <div className={classes.advancedContainer}>
            <Typography className={classes.advancedLabel} variant="subtitle1">
              {t('views.familyProfile.familyDetails')}
            </Typography>
            {!openFamilyDetails ? (
              <KeyboardArrowDown className={classes.expandIcon} />
            ) : (
              <KeyboardArrowUp className={classes.expandIcon} />
            )}
          </div>
        }
      >
        <PersonalDetails
          primaryParticipant={primaryParticipant}
          familyMembers={sanitazedFamilyMembers}
          latitude={latitude}
          longitude={longitude}
          history={history}
          readOnly={readOnly}
        />
      </AccordionItem>

      <AccordionItem
        key={2}
        onExpand={() => setOpenEconomicDetails(!openEconomicDetails)}
        onClose={() => setOpenEconomicDetails(!openEconomicDetails)}
        title={
          <div className={classes.advancedContainer}>
            <Typography className={classes.advancedLabel} variant="subtitle1">
              {t('views.familyProfile.economicDetails')}
            </Typography>
            {!openEconomicDetails ? (
              <KeyboardArrowDown className={classes.expandIcon} />
            ) : (
              <KeyboardArrowUp className={classes.expandIcon} />
            )}
          </div>
        }
        className={clsx(
          openEconomicDetails && classes.item,
          openEconomicDetails && classes.expandedItem
        )}
      >
        <EconomicDetails
          economicData={economicData}
          membersEconomicData={membersEconomicData}
          topics={topics}
          history={history}
          questionsPerTopics={questionsPerTopics}
          familyMembers={familyMembers}
          readOnly={readOnly}
        />
      </AccordionItem>
    </Accordion>
  );
};

export default Details;
