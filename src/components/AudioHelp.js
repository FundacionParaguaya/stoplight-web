import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import ReactPlayer from 'react-player/lazy';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Typography } from '@material-ui/core';

const AudioHelp = ({
  classes,
  audio,
  playAudio,
  handleStop,
  audioProgress,
  audioDuration,
  handlePlayPause,
  setPlayedSeconds,
  setDuration,
  muted,
  t
}) => {
  return (
    <>
      <div className={classes.playerContainer}>
        {!!playAudio ? (
          <>
            <PauseCircleFilledIcon
              onClick={() => handlePlayPause()}
              className={`material-icons ${classes.icon}`}
            />
            <LinearProgress
              variant="determinate"
              className={classes.progressBar}
              value={(audioProgress / audioDuration) * 100}
            />
          </>
        ) : (
          <>
            <PlayCircleFilledIcon
              onClick={() => handlePlayPause()}
              className={`material-icons ${classes.icon}`}
            />
            <Typography variant="subtitle1" className={classes.audioHelp}>
              {t('views.survey.audioHelp')}
            </Typography>
          </>
        )}
        <ReactPlayer
          width="0px"
          height="0px"
          onReady={() => {
            console.log('OnReady');
            handleStop();
          }}
          onDuration={e => setDuration(e)}
          onProgress={e => setPlayedSeconds(e.playedSeconds)}
          playing={playAudio}
          url={audio}
          muted={playAudio ? false : true}
          config={{
            file: {
              forceAudio: true
            }
          }}
        />
      </div>
    </>
  );
};

const styles = () => ({
  playerContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10
  },
  progressBar: {
    marginLeft: 10,
    width: '100%',
    backgroundColor: '#d8d8d8'
  },
  icon: {
    color: 'green',
    cursor: 'pointer',
    fontSize: 30
  },
  audioHelp: {
    marginLeft: 5,
    font: 'Roboto',
    fontWeight: 400
  }
});

export default withRouter(withStyles(styles)(withTranslation()(AudioHelp)));
