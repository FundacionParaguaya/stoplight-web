import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import Container from './Container';
import NavigationBar from './NavigationBar';

const useStyles = makeStyles(theme => ({
  titleContainer: {
    display: 'flex',
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

const Header = ({
  navigationOptions,
  imageSource,
  altTextImage,
  title,
  subtitle1,
  subtitle2
}) => {
  const classes = useStyles();

  return (
    <Container variant="stretch">
      <NavigationBar options={navigationOptions}></NavigationBar>
      <div className={classes.titleContainer}>
        <img src={imageSource} alt={altTextImage} className={classes.image} />
        <div className={classes.familyInfo}>
          <Typography variant="h4">{title}</Typography>
          <div className={classes.container}>
            <Typography variant="subtitle1" className={classes.subtitle}>
              {subtitle1}
            </Typography>
          </div>
          {!!subtitle2 && (
            <div className={classes.container}>
              <Typography variant="subtitle1" className={classes.subtitle}>
                {subtitle2}
              </Typography>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default Header;
