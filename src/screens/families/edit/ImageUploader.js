import { Typography } from '@material-ui/core';
import FormHelperText from '@material-ui/core/FormHelperText';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import GetAppIcon from '@material-ui/icons/GetApp';
import CloseIcon from '@material-ui/icons/Cancel';
import BackupIcon from '@material-ui/icons/Backup';
import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { MB_SIZE, getPreviewForFile } from '../../../utils/files-utils';

const useStyles = makeStyles(theme => ({
  dropzone: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '35vh',
    marginTop: 8,
    padding: 5,
    borderWidth: 3,
    borderRadius: 2,
    borderColor: theme.palette.grey.quarter,
    borderStyle: 'dashed',
    backgroundColor: theme.palette.grey.light,
    outline: 'none',
    width: '100%',
    marginBottom: 10
  },
  thumbsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    marginBottom: 16
  },
  preview: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '3px 6px 3px 6px'
  },
  thumb: {
    position: 'relative',
    display: 'inline-flex',
    borderRadius: 2,
    border: `1px solid ${theme.palette.primary.main}`,
    marginBottom: 8,
    marginRight: 8,
    width: 200,
    height: 200,
    padding: 4,
    boxSizing: 'border-box'
  },
  thumbInner: {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
  },
  img: {
    display: 'block',
    width: '100%',
    height: '100%'
  },
  thumbName: {
    maxWidth: 100,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  },
  icon: {
    fontSize: '10vh',
    color: theme.palette.grey.quarter
  },
  closeButton: {
    position: 'absolute',
    top: -5,
    right: -6
  },
  color: {
    color: theme.palette.grey.quarter
  },
  downloadButton: {
    position: 'absolute',
    bottom: -5,
    right: -6,
    minWidth: 36,
    padding: 0,
    borderRadius: '50%'
  }
}));

const maxSize = 10 * MB_SIZE;

const ImageUploader = ({ files, setFiles, fileError, setFileError }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [filesSize, setFilesSize] = useState(0);

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach(file => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  useEffect(() => {
    setFileError(filesSize > maxSize);
  }, [filesSize]);

  const onDropAccepted = acceptedFiles => {
    let dropSize = 0;
    let accepted = acceptedFiles.map(file => {
      dropSize += file.size;
      return file.type.includes('image/')
        ? Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        : file;
    });
    let newFiles = [...files, ...accepted];
    setFiles(newFiles);
    setFilesSize(filesSize + dropSize);
  };

  const { getRootProps, getInputProps } = useDropzone({
    maxSize: maxSize,
    onDropAccepted,
    onDropRejected: () => setFileError(true),
    accept: ['.png', '.jpg', '.heic', '.heif']
  });

  const removeItem = name => {
    let deletedSize = 0;
    let updatedFiles = files.filter(file => {
      if (file.name === name) deletedSize = file.size;
      return file.name !== name;
    });
    updatedFiles ? setFiles([...updatedFiles]) : setFiles([]);
    setFilesSize(filesSize - deletedSize);
  };

  const thumbs = files.map(file => (
    <div className={classes.preview} key={file.name} data-testid={file.name}>
      <div className={classes.thumb}>
        <div className={classes.thumbInner}>
          <IconButton
            className={classes.closeButton}
            key="clear"
            onClick={() => removeItem(file.name)}
          >
            <CloseIcon className={classes.color} />
          </IconButton>
          <Button
            href={file.url}
            className={classes.downloadButton}
            download
            color="primary"
          >
            <GetAppIcon />
          </Button>
          <img alt="" src={getPreviewForFile(file)} className={classes.img} />
        </div>
      </div>
      <Tooltip title={file.name}>
        <Typography
          variant="subtitle2"
          align="center"
          className={classes.thumbName}
        >
          {file.name}
        </Typography>
      </Tooltip>
    </div>
  ));

  return (
    <React.Fragment>
      <div
        {...getRootProps({ className: classes.dropzone })}
        data-testid="dropzone"
      >
        <input {...getInputProps()} />
        <BackupIcon className={classes.icon} />
        <Typography style={{ paddingTop: 15 }} variant="subtitle2">
          {t('views.familyImages.placeholder')}
        </Typography>
      </div>
      <aside className={classes.thumbsContainer}>{thumbs}</aside>
      {fileError && (
        <FormHelperText error={fileError} style={{ textAlign: 'center' }}>
          {t('views.familyImages.uploadError')}
        </FormHelperText>
      )}
    </React.Fragment>
  );
};

export default ImageUploader;
