import React from 'react';
import CloseIcon from '@material-ui/icons/Cancel';
import { Typography, makeStyles } from '@material-ui/core/';
import IconButton from '@material-ui/core/IconButton';
import BackupIcon from '@material-ui/icons/Backup';
import Link from '@material-ui/core/Link';

const useStyles = makeStyles(theme => ({
  dropzone: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 85,
    paddingBottom: 60,
    borderWidth: 6,
    borderRadius: 2,
    borderColor: '#d8d8d8',
    borderStyle: 'dashed',
    backgroundColor: '#f5f5f5',
    color: '#bdbdbd',
    outline: 'none',
    width: '100%'
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'sans-serif',
    minHeight: '35vh',
    alignItems: 'center'
  },
  icon: {
    fontSize: '15vh',
    color: '#309E43'
  },
  img: {
    display: 'block',
    width: 'auto',
    height: '100%'
  }
}));

export default function FileForm({
  acceptedFiles,
  getRootProps,
  getInputProps,
  removeItem,
  t
}) {
  const classes = useStyles();

  const files = acceptedFiles.map(file => (
    <Typography variant="subtitle1" key={file.key}>
      {file.url && (
        <Link href={file.url} target="_blank">
          {file.path} - {(file.fileSize / 1048576).toFixed(2)} MB
        </Link>
      )}
      {!file.url && `${file.path} - ${(file.fileSize / 1048576).toFixed(2)} MB`}
      <IconButton key="clear" onClick={() => removeItem(file.key)}>
        <CloseIcon style={{ color: '#309E43' }} />
      </IconButton>
    </Typography>
  ));

  return (
    <section className={classes.container}>
      <div {...getRootProps({ className: classes.dropzone })}>
        <input {...getInputProps()} />
        <Typography variant="subtitle1">{t('views.uploadFiles')} </Typography>
        <BackupIcon className={classes.icon} />
      </div>
      <aside className="mt-3">
        <ul>{files}</ul>
      </aside>
    </section>
  );
}
