import React from 'react';
import { Typography } from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Slider from 'react-slick';
import { makeStyles } from '@material-ui/core/styles';

// Import css files
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const useStyles = makeStyles(theme => ({
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
    maxWidth: 300,
    [theme.breakpoints.down('xs')]: {
      width: '95%'
    },
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
}));

const NextArrow = ({ currentSlide, slideCount, ...props }) => {
  const classes = useStyles();
  return (
    <div className={classes.arrowIcon} {...props}>
      <ArrowForwardIosIcon color="primary" />
    </div>
  );
};

const PrevArrow = ({ currentSlide, slideCount, ...props }) => {
  const classes = useStyles();
  return (
    <div className={classes.arrowIcon} {...props}>
      <ArrowForwardIosIcon className={classes.leftIcon} color="primary" />
    </div>
  );
};

const ProjectsCarousel = ({ projects, handleClick }) => {
  const classes = useStyles();

  let settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,

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
      <Slider nextArrow={<NextArrow />} prevArrow={<PrevArrow />} {...settings}>
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
              <Typography align="center" className={classes.title} variant="h5">
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
  );
};

export default ProjectsCarousel;
