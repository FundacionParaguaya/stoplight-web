import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TextInput from '../../../components/TextInput';
import IconButton from '@material-ui/core/IconButton';
import LeftArrow from '@material-ui/icons/ChevronLeftOutlined';

const useStyles = makeStyles(theme => ({
  mainContainer: {
    width: '-webkit-fill-available',
    display: 'flex',
    flexDirection: 'column',
    padding: '3rem'
  },
  container: {
    display: 'flex',
    alignItems: 'center'
  },
  title: {
    color: 'black'
  },
  icon: {
    fontSize: 30
  },
  formContainer: {
    backgroundColor: theme.palette.background.default,
    width: 600,
    height: '25vh',
    marginTop: '2rem',
    padding: '2rem'
  },
  buttonContainer: {
    marginTop: '2rem',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start'
  }
}));

const TopicForm = ({ topic, updateTopics, toggle }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [formTopic, setFormTopic] = useState({
    value: '',
    text: '',
    audioUrl: ''
  });

  useEffect(() => {
    setFormTopic(topic);
  }, [topic]);

  return (
    <div className={classes.mainContainer}>
      <div className={classes.container}>
        <IconButton style={{ marginLeft: 4 }} onClick={() => toggle()}>
          <LeftArrow style={{ cursor: 'pointer' }} className={classes.icon} />
        </IconButton>
        <Typography variant="h5" className={classes.title}>
          {t('views.surveyBuilder.economic.topic.new')}
        </Typography>
      </div>

      <div className={classes.formContainer}>
        <TextInput
          label={t('views.surveyBuilder.title')}
          value={formTopic.text}
          onChange={e => {
            setFormTopic({ ...formTopic, text: e.target.value });
          }}
        />
        <Typography variant="subtitle2" style={{ marginTop: '1rem' }}>
          {t('views.surveyBuilder.audioSupport')}
        </Typography>
      </div>
      <div className={classes.buttonContainer}>
        <Button
          color="primary"
          variant="contained"
          style={{ marginRight: '1rem' }}
          onClick={() => {
            updateTopics(formTopic);
            toggle();
          }}
        >
          {t('general.save')}
        </Button>
        <Button variant="outlined" color="secondary" onClick={() => toggle()}>
          {t('general.cancel')}
        </Button>
      </div>
    </div>
  );
};

export default TopicForm;
