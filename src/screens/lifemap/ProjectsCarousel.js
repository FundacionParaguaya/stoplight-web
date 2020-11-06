import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Slider from 'react-slick';

const ProjectsCarousel = ({ classes, projects, handleClick }) => {
  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: (
      <div className={classes.arrowIcon}>
        <ArrowForwardIosIcon color="primary" />
      </div>
    ),
    prevArrow: (
      <div className={classes.arrowIcon}>
        <ArrowForwardIosIcon className={classes.leftIcon} color="primary" />{' '}
      </div>
    ),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className={classes.container}>
      <div>
        <Slider {...settings}>
          {projects.map((project, index) => (
            <React.Fragment key={index}>
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
              </div>
            </React.Fragment>
          ))}
        </Slider>
      </div>
    </div>
  );
};

const styles = theme => ({
  container: {
    width: '100%',
    paddingTop: '2rem',
    paddingRight: '2em',
    paddingLeft: '2em',
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
    minWidth: 260,
    width: 300,
    boxShadow: `1px 2px 5px ${theme.palette.grey.main}`,
    marginRight: '20px'
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
