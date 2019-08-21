import React, { useState } from 'react';
import { Modal, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import face from '../assets/happy_face.png';
import { COLORS } from '../theme';

const PROD_ENV = 'platform';

const useStyles = makeStyles(theme => ({
  mainContainer: {
    width: '35vw',
    [theme.breakpoints.down('md')]: {
      width: '45vw'
    },
    [theme.breakpoints.down('sm')]: {
      width: '60vw'
    },
    [theme.breakpoints.down('xs')]: {
      width: '90vw'
    },
    backgroundColor: theme.palette.background.default,
    outline: 'none',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    padding: '35px 50px'
  },
  buttonContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(4)
  },
  icon: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2),
    width: '55px'
  },
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing(2),
    color: COLORS.RED,
    fontSize: '22px'
  },
  subtitle: {
    textAlign: 'center',
    color: '#1C212F',
    fontSize: '15px',
    fontWeight: theme.typography.fontWeightMedium
  },
  exitLabel: {
    textAlign: 'center',
    marginBottom: theme.spacing(3),
    color: COLORS.RED,
    fontSize: '15px',
    fontWeight: theme.typography.fontWeightMedium
  }
}));

const NonProdWarning = ({ children, user: { env } }) => {
  const [allow, setAllow] = useState(false);
  const classes = useStyles();
  const { t } = useTranslation();
  const preAllow = env === PROD_ENV;
  return (
    <React.Fragment>
      {(allow || preAllow) && <React.Fragment>{children}</React.Fragment>}
      {!allow && !preAllow && (
        <React.Fragment>
          <Modal
            open
            BackdropProps={{
              style: { backgroundColor: 'rgba(0, 0, 0, 0.23)' }
            }}
          >
            <div className={classes.mainContainer}>
              <img src={face} className={classes.icon} alt="Warning icon" />
              <Typography className={classes.title} variant="h5">
                {t('views.nonProdWarning.title')}
              </Typography>
              <Typography className={classes.subtitle} variant="subtitle2">
                {t('views.nonProdWarning.subtitle')}
              </Typography>
              <Typography className={classes.exitLabel} variant="subtitle2">
                {t('views.nonProdWarning.bottom')}
              </Typography>
              <div className={classes.buttonContainer}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => setAllow(true)}
                >
                  {t('general.gotIt')}
                </Button>
              </div>
            </div>
          </Modal>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

const mapStateToProps = ({ user }) => ({
  user
});
const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NonProdWarning);
