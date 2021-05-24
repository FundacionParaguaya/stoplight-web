import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import ReactPlayer from 'react-player/lazy';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';

import { Typography } from '@material-ui/core';

const AudioHelp = ({ classes, audio, playAudio, handlePlayPause, t }) => {
  const rtl = document.body.getAttribute('dir') === 'rtl';
  return (
    <>
      <div className={classes.playerContainer}>
        {!!playAudio ? (
          <>
            <ReactPlayer
              width="300px"
              height="35px"
              controls
              onReady={() => {}}
              playing={playAudio}
              url={audio}
              muted={playAudio ? false : true}
              config={{
                file: {
                  forceAudio: true
                }
              }}
            />
          </>
        ) : (
          <>
            <PlayCircleFilledIcon
              onClick={() => handlePlayPause()}
              className={`material-icons ${classes.icon}`}
              style={rtl && { transform: 'scaleX(-1)' }}
            />
            <Typography variant="subtitle1" className={classes.audioHelp}>
              {t('views.survey.audioHelp')}
            </Typography>
            <ReactPlayer
              width="0px"
              height="0px"
              onReady={() => {}}
              playing={playAudio}
              url={audio}
              muted={playAudio ? false : true}
              config={{
                file: {
                  forceAudio: true
                }
              }}
            />
          </>
        )}
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
