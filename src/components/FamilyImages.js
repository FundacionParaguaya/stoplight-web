import React from 'react';
import Carousel, {
  slidesToShowPlugin,
  slidesToScrollPlugin
} from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { withTranslation } from 'react-i18next';

const styles = theme => ({
  img: {
    padding: 30,
    width: '15em',
    height: '20em',
    objectFit: 'cover',
    borderRadius: 50
  }
});

const FamilyImages = ({ classes, t, images }) => {
  return (
    <div>
      <Typography variant="h5" align="center" style={{ margin: 36 }}>
        {t('views.familyImages.title')}
      </Typography>
      <Carousel
        centered
        arrows
        slidesPerPage={4}
        slidesPerScroll={1}
        draggable
        arrowLeft={<ArrowBackIosIcon />}
        arrowRight={<ArrowForwardIosIcon />}
        addArrowClickHandler={true}
      >
        <img
          className={classes.img}
          src="https://homepages.cae.wisc.edu/~ece533/images/airplane.png"
        />
        <img
          className={classes.img}
          src="https://homepages.cae.wisc.edu/~ece533/images/arctichare.png"
        />
        <img
          className={classes.img}
          src="https://homepages.cae.wisc.edu/~ece533/images/baboon.png"
        />
        <img
          className={classes.img}
          src="https://homepages.cae.wisc.edu/~ece533/images/airplane.png"
        />
        <img
          className={classes.img}
          src="https://homepages.cae.wisc.edu/~ece533/images/arctichare.png"
        />
        <img
          className={classes.img}
          src="https://homepages.cae.wisc.edu/~ece533/images/baboon.png"
        />
      </Carousel>
    </div>
  );
};

export default withStyles(styles)(withTranslation()(FamilyImages));
