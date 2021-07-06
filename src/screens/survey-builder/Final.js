import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import checkgif from '../../assets/check.gif';
import withLayout from '../../components/withLayout';
import Header from './Header';

const useStyles = makeStyles(theme => ({
  mainContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: theme.palette.background.paper,
    padding: '0 12%'
  },
  container: {
    position: 'relative',
    height: '45vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.background.default
  },
  buttonContainer: {
    margin: '2rem 0',
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
  },
  text: {
    position: 'absolute',
    top: '75%'
  }
}));

const Final = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <div className={classes.mainContainer}>
      <Header title={''} />
      <div className={classes.container}>
        <img alt="done gif" height="265" width="350" src={checkgif} />
        <Typography variant="h6" className={classes.text}>
          {t('views.surveyBuilder.final.subtitle')}
        </Typography>
      </div>
      <div className={classes.buttonContainer}>
        <Button
          type="submit"
          color="primary"
          variant="contained"
          onClick={() => history.push('/surveysList')}
        >
          {t('views.surveyBuilder.final.goTo')}
        </Button>
      </div>
    </div>
  );
};

export default withLayout(Final);
