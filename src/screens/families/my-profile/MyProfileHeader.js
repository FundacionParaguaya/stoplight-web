import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import leftColors from '../../../assets/left.png';
import defaultImage from '../../../assets/profile_placeholder.png';
import rightColors from '../../../assets/right.png';
import Container from '../../../components/Container';
import { checkAccessToProjects } from '../../../utils/role-utils';
import UploadImageModal from './UploadImageModal';

const useStyles = makeStyles(theme => ({
  titleContainer: {
    justifyContent: 'space-between',
    position: 'relative',
    marginTop: '2rem'
  },
  familyInfo: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    height: 'fit-content',
    minHeight: 180,
    [theme.breakpoints.down('sm')]: {
      minHeight: 150
    },
    [theme.breakpoints.down('xs')]: {
      minHeight: 120
    }
  },
  image: {
    maxWidth: 200,
    maxHeight: 180,
    borderRadius: '50%',
    marginRight: 5,
    [theme.breakpoints.down('md')]: {
      minHeight: 155
    }
  },
  icon: {
    position: 'absolute',
    fontSize: 30,
    top: 60,
    right: '44%',
    color: 'white'
  },
  container: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      marginTop: 0
    }
  },
  subtitle: {
    marginRight: theme.spacing(1)
  },
  imagesContainer: {
    display: 'flex',
    paddingBottom: 15,
    justifyContent: 'flex-end',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'space-around'
    }
  },
  leftImage: {
    maxWidth: 115,
    marginRight: 5,
    [theme.breakpoints.down('sm')]: {
      maxWidth: 80,
      height: 160
    }
  },
  rightImage: {
    maxWidth: 100,
    [theme.breakpoints.down('sm')]: {
      maxWidth: 70,
      height: 150
    }
  }
}));

const MyProfileHeader = ({ family, user }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [openModal, setOpenModal] = useState(false);

  const toggleModal = reloadPage => {
    setOpenModal(!openModal);
    if (reloadPage) {
      window.location.reload();
    }
  };

  return (
    <Container variant="stretch">
      <UploadImageModal
        open={openModal}
        toggleModal={toggleModal}
        familyId={family.familyId}
        user={user}
      />
      <Grid container className={classes.titleContainer}>
        <Grid item md={4} sm={6} xs={12} className={classes.familyInfo}>
          <Typography variant="h4">{family.name}</Typography>
          <div className={classes.container}>
            <Typography variant="subtitle1" className={classes.subtitle}>
              {t('views.familyProfile.organization')}
            </Typography>

            <Typography variant="subtitle1">
              {family.organization ? family.organization.name : ''}
            </Typography>
          </div>
          {!!family.project && checkAccessToProjects(user) && (
            <div className={classes.container}>
              <Typography variant="subtitle1" className={classes.subtitle}>
                {t('views.familyProfile.projectTitle')}
              </Typography>
              <Typography variant="subtitle1">
                {family.project.title}
              </Typography>
            </div>
          )}
        </Grid>
        <Grid item md={8} sm={6} xs={12} className={classes.imagesContainer}>
          <img src={leftColors} alt="left" className={classes.leftImage} />
          <div style={{ position: 'relative' }}>
            <img
              src={family.profilePictureUrl || defaultImage}
              alt="Profile"
              className={classes.image}
              onClick={() => setOpenModal(true)}
            />
            {!family.profilePictureUrl && (
              <AddAPhotoIcon
                onClick={() => setOpenModal(true)}
                className={classes.icon}
              />
            )}
          </div>
          <img src={rightColors} alt="right" className={classes.rightImage} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default MyProfileHeader;
