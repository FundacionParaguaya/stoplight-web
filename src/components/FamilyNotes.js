import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import { withSnackbar } from 'notistack';
import iconNotes from '../assets/pen_icon.png';
import Container from './Container';
import { getDateFormatByLocale } from '../utils/date-utils';

const FamilyNotes = ({
  classes,
  notes,
  handleSaveNote,
  showCreateNote,
  handleInput,
  note,
  user,
  loading,
  t,
  i18n: { language }
}) => {
  const dateFormat = getDateFormatByLocale(language);

  return (
    <Fragment>
      <Container className={classes.basicInfo} variant="fluid">
        <div className={classes.iconBaiconFamilyBorder}>
          <img
            src={iconNotes}
            className={classes.iconFamily}
            alt="Family Notes"
          />
        </div>
      </Container>

      <Container className={classes.notesContainer} variant="fluid">
        <Typography variant="h5" align="center" style={{ marginBottom: 36 }}>
          {t('views.familyNotes.Notes')}
        </Typography>
        {notes.map((familyNote, index) => (
          <Card
            key={index}
            className={classes.note}
            style={
              user.username.toLowerCase() === familyNote.noteUser.toLowerCase()
                ? { alignSelf: 'flex-end' }
                : { alignSelf: 'flex-start' }
            }
          >
            <Typography className={classes.noteMsg} variant="h6" align="left">
              {familyNote.note}
            </Typography>
            <Typography className={classes.noteMsg} variant="h6" align="right">
              {t('views.familyNotes.by')}{' '}
              <Typography
                style={{ fontWeight: 600 }}
                display="inline"
                variant="h6"
                component={'span'}
              >
                {familyNote.noteUser}
              </Typography>{' '}
              - {moment.unix(familyNote.noteDate).format(dateFormat)}
            </Typography>
          </Card>
        ))}
        {notes.length === 0 && (
          <Typography variant="h6" align="center" className={classes.emptyList}>
            {t('views.familyNotes.EmptyNotesList')}
          </Typography>
        )}
        {loading && (
          <div className={classes.loadingContainer}>
            <CircularProgress size={50} thickness={2} />
          </div>
        )}

        {showCreateNote(user) && (
          <Fragment>
            <OutlinedInput
              classes={{
                root: classes.outlinedInputContainer,
                input: classes.outlinedInput
              }}
              placeholder={t('views.familyNotes.NotePlaceHolder')}
              multiline={true}
              value={note}
              inputProps={{ maxLength: '10000' }}
              onChange={handleInput}
              margin="dense"
            />
            <Button
              color="primary"
              disabled={note.length === 0 || loading}
              onClick={handleSaveNote}
              className={classes.buttonContained}
              variant="contained"
            >
              {t('general.save')}
            </Button>
          </Fragment>
        )}
      </Container>
    </Fragment>
  );
};

const styles = theme => ({
  basicInfo: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    justifyContent: 'center',
    marginTop: '3rem'
  },
  iconFamily: {
    maxWidth: 50,
    maxHeight: 50,
    objectFit: 'contain'
  },
  iconBaiconFamilyBorder: {
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
  notesContainer: {
    backgroundColor: theme.palette.background.default,
    paddingLeft: '12%',
    display: 'flex',
    flexDirection: 'column',
    paddingRight: '12%',
    paddingBottom: '2%'
  },
  note: {
    width: '60%',
    marginBottom: '2rem',
    padding: '1.5rem 2rem',
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  noteMsg: {
    fontSize: 16,
    color: '#6A6A6A',
    padding: '0.5rem 0'
  },
  outlinedInputContainer: {
    marginTop: '1rem',
    marginBottom: '1rem',
    width: '60%',
    alignSelf: 'flex-end',
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  outlinedInput: {
    padding: '1.5rem 1rem !important'
  },
  buttonContained: {
    marginTop: 5,
    marginBottom: 5,
    alignSelf: 'flex-end'
  },
  emptyList: {
    marginBottom: 36,
    color: theme.palette.primary.main
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(3)
  }
});

const mapStateToProps = ({ user }) => ({ user });

export default withRouter(
  withStyles(styles)(
    connect(mapStateToProps)(withTranslation()(withSnackbar(FamilyNotes)))
  )
);
