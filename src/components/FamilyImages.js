import React from 'react';
import Carousel from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { withTranslation } from 'react-i18next';
import Container from '../components/Container';
import iconCamera from '../assets/icon_camera.png';

const styles = theme => ({
  img: {
    padding: 30,
    height: 400,
    width: 300,
    objectFit: 'cover',
    borderRadius: 50,
    minHeight: 360,
    minWidth: 260
  },
  basicInfo: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    justifyContent: 'center',
    marginTop: '3rem'
    //position: 'relative'
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
              centered
              arrows
              slidesPerPage={4}
              slidesPerScroll={1}
              draggable
              arrowLeft={<ArrowBackIosIcon />}
              arrowRight={<ArrowForwardIosIcon />}
              addArrowClickHandler={true}
              breakpoints={{
                640: {
                  slidesPerPage: 1
                },
                900: {
                  slidesPerPage: 2
                }
              }}
            >
              {images.map(img => {
                return (
                  <img
                    className={classes.img}
                    src={img.url}
                    alt="Family screen"
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
