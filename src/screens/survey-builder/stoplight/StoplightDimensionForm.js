import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import LeftArrow from '@material-ui/icons/ChevronLeftOutlined';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TextInput from '../../../components/TextInput';

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
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    minHeight: '15vh',
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

const StoplightDimensionForm = ({ dimension, updateDimensions, toggle }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const [formDimension, setFormDimension] = useState({
    text: ''
  });

  useEffect(() => {
    setFormDimension({ ...formDimension, ...dimension });
  }, [dimension]);

  return (
    <div className={classes.mainContainer}>
      <div className={classes.container}>
        <IconButton style={{ marginLeft: 4 }} onClick={() => toggle()}>
          <LeftArrow style={{ cursor: 'pointer' }} className={classes.icon} />
        </IconButton>
        <Typography variant="h5" className={classes.title}>
          {Number.isInteger(formDimension.value)
            ? t('views.surveyBuilder.stoplight.dimension.edit')
            : t('views.surveyBuilder.stoplight.dimension.delete')}
        </Typography>
      </div>

      <div className={classes.formContainer}>
        <TextInput
          label={t('views.surveyBuilder.title')}
          value={formDimension.text}
          onChange={e => {
            setFormDimension({ ...formDimension, text: e.target.value });
          }}
        />
      </div>
      <div className={classes.buttonContainer}>
        <Button
          color="primary"
          variant="contained"
          style={{ marginRight: '1rem' }}
          onClick={() => {
            if (formDimension.text) {
              updateDimensions(formDimension);
              toggle();
            } else {
              enqueueSnackbar(
                t('views.surveyBuilder.stoplight.dimension.error'),
                {
                  variant: 'error'
                }
              );
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

export default StoplightDimensionForm;
