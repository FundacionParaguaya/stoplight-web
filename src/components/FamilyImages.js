import React from 'react';
import Carousel from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { withTranslation } from 'react-i18next';
import Container from './Container';
import iconCamera from '../assets/icon_camera.png';

const styles = theme => ({
  img: {
    padding: 30,
    height: 400,
    width: 300,
    objectFit: 'cover',
    borderRadius: 50,
    minHeight: 360,
    minWidth: 260,
    transition: 'all .2s ease-in-out',
    '&:hover': {
      transform: 'scale(1.1)'
    }
  },
  basicInfo: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    justifyContent: 'center',
    marginTop: '3rem'
  },
  familyImagesContainer: {
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

  iconBaiconCameraBorder: {
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
  iconCamera: {
    maxWidth: 50,
    maxHeight: 50,
    objectFit: 'contain'
  },
  arrowIcon: {
    borderRadius: 50,
    padding: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)'
    }
  },
  leftIcon: {
    transform: 'rotate(180deg)'
  }
});

const FamilyImages = ({ classes, t, images }) => {
  return (
    <>
      {images && images.length > 0 && (
        <>
          <Container className={classes.basicInfo} variant="fluid">
            <div className={classes.iconBaiconCameraBorder}>
              <img
                src={iconCamera}
                className={classes.iconCamera}
                alt="Family Images"
              />
            </div>
          </Container>

          <Container className={classes.basicInfoText} variant="fluid">
            <Typography variant="h5">
              {t('views.familyImages.title')} · {images ? images.length : 0}
            </Typography>
          </Container>
          <div className={classes.familyImagesContainer}>
            <Carousel
              arrows
              slidesPerPage={3}
              slidesPerScroll={1}
              draggable
              arrowLeft={
                <div className={classes.arrowIcon}>
                  <ArrowForwardIosIcon
                    className={classes.leftIcon}
                    color="primary"
                  />{' '}
                </div>
              }
              arrowRight={
                <div className={classes.arrowIcon}>
                  <ArrowForwardIosIcon color="primary" />{' '}
                </div>
              }
              arrowLeftDisabled={
                <div className={classes.arrowIcon}>
                  <ArrowForwardIosIcon
                    className={classes.leftIcon}
                    color="disabled"
                  />
                </div>
              }
              arrowRightDisabled={
                <div className={classes.arrowIcon}>
                  <ArrowForwardIosIcon color="disabled" />
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
              {images.map((img, index) => {
                return (
                  <img
                    key={index}
                    className={classes.img}
                    src={img.url}
                    alt="Family pictures"
                    data-testid="family-picture"
                  />
                );
              })}
            </Carousel>
          </div>
        </>
      )}
    </>
  );
};

export default withStyles(styles)(withTranslation()(FamilyImages));
