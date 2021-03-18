import React from 'react';
import { Button, Typography } from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { withTranslation } from 'react-i18next';
import Container from './Container';
import iconCamera from '../assets/icon_camera.png';
import { makeStyles } from '@material-ui/core/styles';
import Slider from 'react-slick';
import Tooltip from '@material-ui/core/Tooltip';
import EditIcon from '@material-ui/icons/Edit';
import { ROLES_NAMES } from '../utils/role-utils';

// Import css files
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const useStyles = makeStyles(theme => ({
  img: {
    padding: 30,
    height: 400,
    width: 300,
    objectFit: 'cover',
    borderRadius: 50,
    minHeight: 360,
    minWidth: 260,
    cursor: 'pointer',
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
    cursor: 'pointer',
    alignItems: 'center',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)'
    }
  },
  leftIcon: {
    cursor: 'pointer',
    transform: 'rotate(180deg)'
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

const FamilyImages = ({
  t,
  images,
  showImage,
  familyId,
  snapshotId,
  readOnly,
  history,
  user
}) => {
  const classes = useStyles();
  const settings = {
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

  const showEditButtons = ({ role }) =>
    (role === ROLES_NAMES.ROLE_APP_ADMIN ||
      role === ROLES_NAMES.ROLE_SURVEY_USER_ADMIN ||
      role === ROLES_NAMES.ROLE_SURVEY_USER ||
      role === ROLES_NAMES.ROLE_FAMILY_USER ||
      role === ROLES_NAMES.ROLE_ROOT ||
      role === ROLES_NAMES.ROLE_PS_TEAM) &&
    !readOnly;

  return (
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
      {images && images.length > 0 ? (
        <>
          <div className={classes.familyImagesContainer}>
            {showEditButtons(user) && (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Tooltip title={t('views.solutions.form.editButton')}>
                  <Button
                    style={{ paddingTop: 4, marginRight: '12vw' }}
                    onClick={() =>
                      history.push(
                        `/family/${familyId}/edit-images/${snapshotId}`
                      )
                    }
                  >
                    <EditIcon />
                  </Button>
                </Tooltip>
              </div>
            )}
            <div>
              <Slider
                nextArrow={<NextArrow />}
                prevArrow={<PrevArrow />}
                {...settings}
              >
                {images.map((img, index) => {
                  return (
                    <img
                      key={index}
                      onClick={() => showImage(img.url)}
                      className={classes.img}
                      src={img.url}
                      alt="Family pictures"
                      data-testid="family-picture"
                    />
                  );
                })}
              </Slider>
            </div>
          </div>
        </>
      ) : (
        <>
          <Container
            className={classes.basicInfoText}
            variant="fluid"
            style={{ paddingTop: '2rem', paddingBottom: '2rem' }}
          >
            {showEditButtons(user) && (
              <Button
                variant="contained"
                onClick={() => {
                  history.push(`/family/${familyId}/edit-images/${snapshotId}`);
                }}
              >
                {t('views.familyImages.addImages')}
              </Button>
            )}
          </Container>
        </>
      )}
    </>
  );
};

export default withTranslation()(FamilyImages);
