import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import { useTranslation } from 'react-i18next';
import chooseLifeMap from '../../assets/family.png';
import Container from '../../components/Container';
import NavigationBar from '../../components/NavigationBar';
import { checkAccessToProjects } from '../../utils/role-utils';

const useStyles = makeStyles(theme => ({
  titleContainer: {
    justifyContent: 'space-between',
    position: 'relative'
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
    display: 'block',
    width: '40%',
    right: 30,
    position: 'absolute',
    top: -51,
    [theme.breakpoints.down('md')]: {
      width: '50%',
      minHeight: 155
    },
    [theme.breakpoints.down('sm')]: {
      width: '60%',
      minHeight: 155
    },
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    }
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
  }
}));

const FamilyHeader = ({ family, user }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const navigationOptions = [
    { label: t('views.familyProfile.families'), link: '/families' },
    {
      label: t('views.familyProfile.profile'),
      link: `/family/${family.familyId}`
    }
  ];

  return (
    <Container variant="stretch">
      <NavigationBar options={navigationOptions} />
      <Grid container className={classes.titleContainer}>
        <Grid item md={4} sm={6} xs={12} className={classes.familyInfo}>
          <Typography variant="h4" style={{ textTransform: 'capitalize' }}>
            {family.name}
          </Typography>
          <div className={classes.container}>
            <Typography variant="subtitle1" className={classes.subtitle}>
              {t('views.familyProfile.organization')}
            </Typography>

            <Typography
              variant="subtitle1"
              style={{ textTransform: 'capitalize' }}
            >
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
        <Grid item md={4} sm={5}>
          <img
            src={chooseLifeMap}
            alt="Choose Life Map"
            className={classes.image}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default FamilyHeader;
