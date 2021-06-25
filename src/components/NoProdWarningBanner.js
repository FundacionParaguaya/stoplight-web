import React, { useEffect, useState } from 'react';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

const PROD_ENV = 'platform';

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: '5px',
    marginBottom: '25px'
  },
  alert: {
    '& .MuiAlert-icon': {
      alignItems: 'center'
    },
    '& .MuiAlert-message': {
      marginLeft: theme.spacing(1),
      fontSize: 15
    }
  }
}));

const NoProdWarningAlert = ({ user: { env } }, styles) => {
  const classes = useStyles();
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (env !== PROD_ENV) {
      setVisible(true);
    }
  }, [env]);
  return (
    <>
      {visible && (
        <div className={classes.container}>
          <Alert
            onClose={() => setVisible(false)}
            severity="warning"
            className={classes.alert}
          >
            {t('views.nonProdWarning.warning')}
          </Alert>
        </div>
      )}
    </>
  );
};

const mapStateToProps = ({ user }) => ({
  user
});

export default connect(mapStateToProps)(NoProdWarningAlert);
