import React, { Component } from 'react'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'
import { withTranslation } from 'react-i18next'
import TopTitleContainer from './reusable/TopTitleContainer'
import lifemap_begin_image from '../../assets/lifemap_begin_image.png'
export class Begin extends Component {
  render() {
    const { classes, t, currentSurvey } = this.props
    let questions = currentSurvey.surveyStoplightQuestions.length
    return (
      <div>
        <TopTitleContainer title={t('views.yourLifeMap')} />
        <div className={classes.BeginStopLightContainer}>
          <h2 className={classes.StopLightTitleContainer}>
            {t('views.lifemap.thisLifeMapHas').replace('%n', questions)}
          </h2>
          <img
            style={{ margin: '70px 0 100px 0' }}
            src={lifemap_begin_image}
            alt=""
          />
        </div>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => this.props.history.push('/lifemap/stoplight/0')}
          style={{ color: 'white' }}
        >
          {t('general.continue')}
        </Button>
      </div>
    )
  }
}

const mapStateToProps = ({ currentSurvey }) => ({ currentSurvey })

const styles = {
  BeginStopLightContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  StopLightTitleContainer: {
    width: 460,
    margin: '40px auto 0 auto',
    textAlign: 'center'
  }
}
export default withStyles(styles)(
  connect(mapStateToProps)(withTranslation()(Begin))
)
