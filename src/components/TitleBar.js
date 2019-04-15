import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Typography } from '@material-ui/core'
import { theme } from '../theme'
import NavIcons from './NavIcons'
function TopTitleContainer(props) {
  const { classes } = props
  return (
    <div className={classes.titleAndIconContainerPolicy}>
      <NavIcons />
      <Typography variant="h4">{props.title}</Typography>
    </div>
  )
}
const mapStateToProps = ({ currentSurvey }) => ({ currentSurvey })

const styles = {
  titleAndIconContainerPolicy: {
    backgroundColor: theme.palette.background.default,
    height: 220,
    position: 'relative',
    display: 'flex',
    padding: '10px 40px 10px 10px',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottom: '1px solid #DCDEE3'
  },
  titleMainAll: {
    margin: 'auto'
  }
}
export default withRouter(
  withStyles(styles)(connect(mapStateToProps)(TopTitleContainer))
)
