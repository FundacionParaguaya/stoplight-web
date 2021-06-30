import React, { useEffect, useState } from 'react';
import { Typography, Tooltip } from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Slider from 'react-slick';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

// Import css files
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import CircularProgress from '@material-ui/core/CircularProgress';
import { COLORS } from '../../theme';

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    paddingTop: '2rem',
    paddingBottom: '2rem',
    paddingLeft: 10,
    paddingRight: 10,
    postion: 'relative',
    '& div > div > div:nth-child(1)': {
      display: 'flex',
      width: '100%',
      justifyContent: 'center',
      wordBreak: 'break-word'
    },
    '& div > div > div:nth-child(2)': {
      display: 'flex',
      width: '100%',
      justifyContent: 'center',
      wordBreak: 'break-word'
    },
    '& div > div > div:nth-child(3)': {
      display: 'flex',
      width: '100%',
      justifyContent: 'center',
      wordBreak: 'break-word'
    },
    '& div > .slick-dots': {
      height: 'fit-content',
      bottom: 0,
      top: -25
    }
  },
  questionCard: {
    display: 'block!important',
    backgroundColor: theme.palette.background.default,
    cursor: 'pointer',
    marginTop: 15,
    marginBottom: 20,
    marginRight: 20,
    marginLeft: 20,
    height: '150%',
    width: '90%',
    boxShadow: `1px 2px 5px ${theme.palette.grey.main}`
  },
  description: {
    fontSize: '14px',
    color: theme.palette.grey.middle,
    marginBottom: 7
  },
  questionDescription: {
    position: 'relative',
    zIndex: 22,
    margin: 0,
    textAlign: 'center',
    color: 'white',
    padding: '30px 20px',
    height: '100%'
  },
  imageContainer: {
    position: 'relative'
  },
  leftIcon: {
    cursor: 'pointer',
    transform: 'rotate(180deg)'
  },
  questionImage: {
    objectFit: 'cover',
    width: '100%',
    position: 'absolute',
    top: 0
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
  },
  answeredQuestion: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: '-36px',
    left: '50%',
    transform: 'translate(-50%,0)',
    zIndex: -1
  },
  answeredIcon: {
    color: 'white',
    paddingTop: '3px',
    fontSize: 39,
    height: 70,
    width: 70,
    margin: 'auto',
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  },
  circularProgress: {
    color: 'white',
    height: 240,
    position: 'absolute',
    top: '50%'
  },
  tooltip: {
    fontSize: 18,
    marginRight: 16
  }
}));

const NextArrow = ({ currentSlide, slideCount, interactive, ...props }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [openTooltip, setOpenTooltip] = useState(interactive);

  useEffect(() => {
    setTimeout(() => {
      setOpenTooltip(false);
    }, 4000);
  }, [currentSlide]);

  useEffect(() => {
    setOpenTooltip(interactive && currentSlide < 1);
  }, [currentSlide]);

  return (
    <Tooltip
      title={t('views.lifemap.indicatorSlide')}
      open={openTooltip}
      classes={{
        tooltip: classes.tooltip
      }}
    >
      <div className={classes.arrowIcon} {...props}>
        <ArrowForwardIosIcon color="primary" />
      </div>
    </Tooltip>
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

const StopLightQuestionCarousel = ({
  submitQuestion,
  options,
  imageStatus,
  answeredValue,
  setAspectRatio,
  handleImageLoaded,
  aspectRatio,
  codeName,
  interactive
}) => {
  const classes = useStyles();
  const [showIcon, setShowIcon] = useState(0);
  useEffect(() => {
    setShowIcon(0);
  }, [codeName]);

  let settings = {
    dots: true,
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

  const handleLoad = e => {
    const { width, height } = e.target;
    setAspectRatio(width / height);
    handleImageLoaded(e);
  };

  const getPaddingBottom = a => {
    const paddingBottom = a !== null ? 100 / a : null;
    return { paddingBottom: `${paddingBottom}%` };
  };
  return (
    <div className={classes.container}>
      <Slider
        nextArrow={<NextArrow interactive={interactive} />}
        prevArrow={<PrevArrow />}
        {...settings}
        key={codeName}
      >
        {options.map((option, index) => {
          let color;
          let textColor = 'white';
          if (option.value === 3) {
            color = COLORS.GREEN;
          } else if (option.value === 2) {
            color = COLORS.YELLOW;
            textColor = 'black';
          } else if (option.value === 1) {
            color = COLORS.RED;
          }
          return (
            <React.Fragment key={index}>
              <div
                onMouseEnter={() => setShowIcon(option.value)}
                onMouseLeave={() => setShowIcon(0)}
                onClick={() => submitQuestion(option.value)}
                style={{
                  borderTop: `5px solid ${color}`,
                  borderRadius: 2,
                  backgroundColor: color
                }}
                className={classes.questionCard}
              >
                <React.Fragment>
                  {imageStatus < options.length && (
                    <div
                      className={classes.imageContainer}
                      style={getPaddingBottom(1)}
                    >
                      <div className={classes.loadingContainer}>
                        {' '}
                        <CircularProgress
                          color="inherit"
                          className={classes.circularProgress}
                        />
                      </div>
                      <img
                        onLoad={handleLoad}
                        src={option.url}
                        alt="surveyImg"
                        style={{ display: 'none', height: 0, maxwidth: '100%' }}
                      />
                    </div>
                  )}
                  {imageStatus === options.length && (
                    <div
                      className={classes.imageContainer}
                      style={getPaddingBottom(aspectRatio)}
                    >
                      <img
                        className={classes.questionImage}
                        src={option.url}
                        alt="surveyImg"
                      />
                    </div>
                  )}
                </React.Fragment>

                <div
                  style={{ backgroundColor: color }}
                  className={classes.questionDescription}
                >
                  {(answeredValue === option.value ||
                    showIcon === option.value) && (
                    <div className={classes.answeredQuestion}>
                      <i
                        style={{ backgroundColor: color }}
                        className={`material-icons ${classes.answeredIcon}`}
                      >
                        done
                      </i>
                    </div>
                  )}
                  <Typography style={{ color: textColor }}>
                    {option.description}
                  </Typography>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </Slider>
    </div>
  );
};

export default StopLightQuestionCarousel;
