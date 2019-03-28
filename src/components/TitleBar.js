import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
function TopTitleContainer(props) {
  const { classes } = props
  return (
    <div className={classes.titleAndIconContainerPolicy}>
      <i
        onClick={props.history.goBack}
        style={{ cursor: 'pointer', fontSize: 32 }}
        className="material-icons"
      >
        arrow_back
      </i>
      <h2 className={classes.titleMainAll}>{props.title}</h2>
    </div>
  )
}
const mapStateToProps = ({ currentSurvey }) => ({ currentSurvey })

const styles = {
  titleAndIconContainerPolicy: {
    backgroundColor: '#faefe1',
    display: 'flex',
    padding: '10px 40px 10px 10px',
    alignItems: 'center'
  },
  titleMainAll: {
    margin: 'auto'
  }
}
export default withRouter(
  withStyles(styles)(connect(mapStateToProps)(TopTitleContainer))
)
