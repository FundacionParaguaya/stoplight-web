import { Grid, Popover, Typography, makeStyles } from '@material-ui/core';

import FormHelperText from '@material-ui/core/FormHelperText';
import PhotoSizeSelectActualSharpIcon from '@material-ui/icons/PhotoSizeSelectActualSharp';
import React from 'react';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(theme => ({
  selectorContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10
  },
  smallIcon: {
    width: 32
  },
  label: {
    fontWeight: 400,
    fontFamily: 'Roboto'
  },
  icon: {
    width: 40,
    marginRight: 5
  }
}));

const IconSelector = ({
  items,
  error,
  handleOpenChangeIcon,
  handleCloseChangeIcon,
  touched,
  anchorEl,
  openIcon,
  setFieldValue,
  setTouched,
  id,
  icon
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <React.Fragment>
      <div className={classes.selectorContainer}>
        <Typography variant="subtitle1" className={classes.label}>
          {t('views.dimensions.form.change')}
        </Typography>
        {icon ? (
          <img
            src={icon}
            className={classes.smallIcon}
            onClick={handleOpenChangeIcon}
          />
        ) : (
          <PhotoSizeSelectActualSharpIcon
            style={{ cursor: 'pointer' }}
            color="primary"
            onClick={event => {
              setTouched(
                Object.assign(touched, {
                  icon: true
                })
              );
              handleOpenChangeIcon(event);
            }}
          />
        )}

        <Popover
          id={id}
          anchorEl={anchorEl}
          open={openIcon}
          onClose={handleCloseChangeIcon}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
        >
          <Grid
            container
            style={{
              marginTop: 10,
              maxHeight: 140,
              maxWidth: 360
            }}
          >
            {items.map((dimensionIcon, index) => {
              return (
                <Grid key={index} md={4} sm={4} xs={4} align="center" item>
                  <img
                    onClick={() => {
                      setFieldValue('icon', dimensionIcon.value);
                      handleCloseChangeIcon();
                    }}
                    src={dimensionIcon.value}
                    className={classes.icon}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Popover>
      </div>
      {error && (
        <FormHelperText error={error}>
          {t('validation.fieldIsRequired')}
        </FormHelperText>
      )}
    </React.Fragment>
  );
};

export default IconSelector;
