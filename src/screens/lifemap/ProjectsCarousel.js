import React from 'react';
import Carousel from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

const ProjectsCarousel = ({ classes, projects, handleClick }) => {
  return (
    <div className={classes.container}>
      <Carousel
        arrows
        slidesPerPage={3}
        slidesPerScroll={1}
        draggable
        arrowLeft={
          <div className={classes.arrowIcon}>
            <ArrowForwardIosIcon className={classes.leftIcon} color="primary" />{' '}
          </div>
        }
        arrowRight={
          <div className={classes.arrowIcon}>
            <ArrowForwardIosIcon color="primary" />{' '}
          </div>
        }
        arrowLeftDisabled={
          <div className={classes.arrowIcon}>
            {/* <ArrowForwardIosIcon
                            className={classes.leftIcon}
                            color="disabled"
                        /> */}
          </div>
        }
        arrowRightDisabled={
          <div className={classes.arrowIcon}>
            {/* <ArrowForwardIosIcon color="disabled" /> */}
          </div>
        }
        addArrowClickHandler={true}
        breakpoints={{
          640: {
            slidesPerPage: 2
          },
          900: {
            slidesPerPage: 2
          }
        }}
      >
        {projects.map((project, index) => {
          return (
            <>
              <div
                key={index}
                style={{
                  backgroundColor: project.color ? project.color : '#fff'
                }}
                className={classes.projectCard}
                onClick={() => handleClick(true, project.id)}
              >
                <Typography
                  align="center"
                  className={classes.title}
                  variant="h5"
                >
                  {' '}
                  {project.title}
                </Typography>
                <Typography className={classes.description} variant="body2">
                  {project.description}
                </Typography>
              </div>{' '}
            </>
          );
        })}
      </Carousel>
    </div>
  );
};

const styles = theme => ({
  container: {
    display: 'flex',
    width: '100%',
    paddingTop: '2rem',

    paddingBottom: '2rem'
  },
  projectCard: {
    backgroundColor: theme.palette.background.default,
    cursor: 'pointer',
    marginTop: 15,
    marginBottom: 20,
    padding: '1rem 20px 5px 20px',
    height: '100%',
    minHeight: 240,
    width: 300,
    boxShadow: `1px 2px 5px ${theme.palette.grey.main}`,
    marginRight: '2em'
  },
  title: {
    lineHeight: 1.2,
    height: '20%',
    fontSize: '18px',
    marginRight: 'auto',
    marginBottom: 7,
    fontWeight: theme.typography.fontWeightBold,
    cursor: 'pointer',
    textAlign: 'center'
  },
  description: {
    fontSize: '14px',
    color: theme.palette.grey.middle,
    marginBottom: 7
  },
  leftIcon: {
    cursor: 'pointer',
    transform: 'rotate(180deg)'
  },
  arrowIcon: {
    borderRadius: 50,
    padding: 10,
    display: 'flex',
    justifyContent: 'center',
    cursor: 'pointer',
    alignItems: 'center',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)'
    }
  }
});

export default withStyles(styles)(ProjectsCarousel);
