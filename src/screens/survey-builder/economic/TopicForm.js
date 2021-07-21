import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import LeftArrow from '@material-ui/icons/ChevronLeftOutlined';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TextInput from '../../../components/TextInput';
import HelpArticle from '../HelpArticle';
import AudioUploader from '../AudioUploader';

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
    minHeight: '35vh',
    padding: '2rem'
  },
  articleContainer: {
    width: '-webkit-fill-available',
    maxWidth: 600,
    height: 339,
    marginLeft: '2rem'
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
  const { enqueueSnackbar } = useSnackbar();

  const [formTopic, setFormTopic] = useState({
    value: '',
    text: '',
    audioUrl: ''
  });

  useEffect(() => {
    setFormTopic({ text: '', ...topic });
  }, [topic]);

  return (
    <div className={classes.mainContainer}>
      <div className={classes.container}>
        <IconButton style={{ marginLeft: 4 }} onClick={() => toggle()}>
          <LeftArrow style={{ cursor: 'pointer' }} className={classes.icon} />
        </IconButton>
        <Typography variant="h5" className={classes.title}>
          {Number.isInteger(formTopic.value)
            ? t('views.surveyBuilder.economic.topic.editTopic')
            : t('views.surveyBuilder.economic.topic.new')}
        </Typography>
      </div>

      <div className={classes.container}>
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

          <AudioUploader
            audioUrl={formTopic.audioUrl}
            onChange={url => {
              setFormTopic({ ...formTopic, audioUrl: url });
            }}
          />
        </div>
        <div className={classes.articleContainer}>
          <HelpArticle section={'TOPIC_FORM'} />
        </div>
      </div>
      <div className={classes.buttonContainer}>
        <Button
          color="primary"
          variant="contained"
          style={{ marginRight: '1rem' }}
          onClick={() => {
            if (formTopic.text) {
              updateTopics(formTopic);
              toggle();
            } else {
              enqueueSnackbar(t('views.surveyBuilder.economic.topic.error'), {
                variant: 'error'
              });
            }
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
