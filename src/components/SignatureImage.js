import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button, Typography } from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import Container from '../components/Container';
import iconPen from '../assets/pen_icon.png';
import Tooltip from '@material-ui/core/Tooltip';
import EditIcon from '@material-ui/icons/Edit';
import { ROLES_NAMES } from '../utils/role-utils';

const styles = theme => ({
  image: {
    width: '50%',
    minHeight: 200,
    maxHeight: 500,
    minWidth: 200,
    cursor: 'pointer'
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
  },
  editButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    backgroundColor: theme.palette.background.default
  },
  editButton: {
    paddingTop: 4,
    marginRight: '22vw'
  }
});

const SignatureImage = ({
  classes,
  t,
  image,
  showImage,
  familyId,
  snapshotId,
  readOnly,
  history,
  user
}) => {
  const showEditButtons = ({ role }) =>
    (role === ROLES_NAMES.ROLE_APP_ADMIN ||
      role === ROLES_NAMES.ROLE_SURVEY_USER_ADMIN ||
      role === ROLES_NAMES.ROLE_SURVEY_USER ||
      role === ROLES_NAMES.ROLE_FAMILY_USER ||
      role === ROLES_NAMES.ROLE_ROOT ||
      role === ROLES_NAMES.ROLE_PS_TEAM) &&
    !readOnly;

  return (
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
        <Typography variant="h5">{t('views.familySignature.title')}</Typography>
      </Container>
      {showEditButtons(user) && !!image && (
        <div className={classes.editButtonContainer}>
          <Tooltip title={t('views.solutions.form.editButton')}>
            <Button
              className={classes.editButton}
              onClick={() =>
                history.push(`/family/${familyId}/edit-sign/${snapshotId}`)
              }
            >
              <EditIcon />
            </Button>
          </Tooltip>
        </div>
      )}
      {!!image ? (
        <div className={classes.signatureContainer}>
          <img
            src={image}
            onClick={() => showImage(image)}
            data-testid="signature-image"
            className={classes.image}
            alt="Signature"
          />
        </div>
      ) : (
        <>
          {showEditButtons(user) && (
            <Container
              className={classes.basicInfoText}
              variant="fluid"
              style={{ paddingTop: '2rem', paddingBottom: '2rem' }}
            >
              <Button
                variant="contained"
                onClick={() => {
                  history.push(`/family/${familyId}/edit-sign/${snapshotId}`);
                }}
              >
                {t('views.familySignature.addSign')}
              </Button>
            </Container>
          )}
        </>
      )}
    </>
  );
};

export default withStyles(styles)(withTranslation()(SignatureImage));
