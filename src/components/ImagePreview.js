import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/core/styles';
import GetAppIcon from '@material-ui/icons/GetApp';
import React from 'react';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(() => ({
  imagePreview: {
    width: '100%'
  },
  previewContent: {
    overflowY: 'hidden'
  },
  btnDialog: {
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'none'
    }
  },
  btnContainer: {
    padding: '8px 24px'
  }
}));

const ImagePreview = ({ open, imageUrl, togglePreview }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <Dialog
      open={open}
      onClose={() => togglePreview(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent className={classes.previewContent}>
        <img
          className={classes.imagePreview}
          src={imageUrl}
          alt={'Family gallery or signature'}
        />
      </DialogContent>
      <DialogActions className={classes.btnContainer}>
        <Button
          href={imageUrl}
          className={classes.btnDialog}
          download
          color="primary"
        >
          <GetAppIcon />
          {t('views.familyProfile.download')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImagePreview;
