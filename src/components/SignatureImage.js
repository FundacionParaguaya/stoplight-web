import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import Container from '../components/Container';
import iconPen from '../assets/pen_icon.png';

const styles = theme => ({
  image: {
    borderRadius: 50,
    height: 'auto',
    width: '50%',
    minWidth: 300
  },
  basicInfo: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    justifyContent: 'center',
    marginTop: '3rem'
  },
  signatureContainer: {
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    paddingTop: '2rem',
    paddingRight: '12%',
    paddingLeft: '12%',
    paddingBottom: '2rem'
  },
  basicInfoText: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },

  iconBaiconPenBorder: {
    border: '2px solid #FFFFFF',
    borderRadius: '50%',
    backgroundColor: '#FFFFFF',
    minWidth: 90,
    minHeight: 90,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '-2%',
    position: 'relative'
  },
  iconPen: {
    maxWidth: 50,
    maxHeight: 50,
    objectFit: 'contain'
  }
});

const SignatureImage = ({ classes, t, image }) => {
  return (
    <>
      {!!image && (
        <>
          <Container className={classes.basicInfo} variant="fluid">
            <div className={classes.iconBaiconPenBorder}>
              <img
                src={iconPen}
                className={classes.iconPen}
                alt="Family Signature"
              />
            </div>
          </Container>

          <Container className={classes.basicInfoText} variant="fluid">
            <Typography variant="h5">
              {t('views.familySignature.title')}
            </Typography>
          </Container>
          <div className={classes.signatureContainer}>
            <img src={image} className={classes.image} alt="Signature" />
          </div>
        </>
      )}
    </>
  );
};

export default withStyles(styles)(withTranslation()(SignatureImage));
