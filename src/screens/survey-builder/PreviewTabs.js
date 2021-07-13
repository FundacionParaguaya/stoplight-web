import { makeStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import React from 'react';

const useStyles = makeStyles(theme => ({
  tabsRoot: {
    maxWidth: '50vw',
    position: 'relative',
    zIndex: 10,
    marginBottom: -4,
    width: 'fit-content',
    marginTop: '1rem',
    backgroundColor: theme.palette.background.default,
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
    maxWidth: 300,
    padding: '5px 15px',
    color: theme.typography.h4.color,
    height: 'auto',
    width: 'auto',
    backgroundColor: theme.palette.background.default,
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
    wordBreak: 'break-word',
    [theme.breakpoints.down('xs')]: {
      fontSize: 14
    }
  }
}));

const PreviewTabs = ({
  surveyTopics,
  selectedSurveyTopic,
  setSelectedSurveyTopic
}) => {
  const classes = useStyles();
  return (
    <Tabs
      value={selectedSurveyTopic ? selectedSurveyTopic.value : 0}
      onChange={(event, value) =>
        setSelectedSurveyTopic(surveyTopics.find(s => s.value === value))
      }
      indicatorColor="secondary"
      textColor="secondary"
      variant="scrollable"
      scrollButtons="auto"
      classes={{ root: classes.tabsRoot }}
    >
      {surveyTopics.map((topic, index) => (
        <Tab
          key={index}
          classes={{ root: classes.tabRoot }}
          label={
            <Typography variant="h6" className={classes.tabTitle}>
              {topic.text}
            </Typography>
          }
          value={topic.value}
        />
      ))}
    </Tabs>
  );
};

export default PreviewTabs;
