import React, { Component } from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import logo from './assets/icon_stoplight.png'
import { theme } from './theme'

class Header extends Component {
  render() {
    const { classes } = this.props
    console.log(theme)
    return (
      <AppBar className={classes.header} position="fixed">
        <Toolbar className={classes.toolbar} disableGutters={false}>
          <div className={classes.menuLink}>
            <img
              style={{ marginTop: 1 }}
              src={logo}
              alt="Stoplight Logo"
              width={48}
              height={48}
            />
          </div>
          <div className={classes.menuLink}>
            <Typography className={classes.menuLinkText}>Surveys</Typography>
          </div>
          <div className={classes.menuLink}>
            <Typography className={classes.menuLinkText}>Households</Typography>
          </div>
          <div className={classes.menuLink}>
            <Typography className={classes.menuLinkText}>Map</Typography>
          </div>
        </Toolbar>
      </AppBar>
    )
  }
}

const styles = {
  header: {
    boxShadow: 'none'
  },
  toolbar: {
    minHeight: 60,
    padding: 0,
    alignItems: 'stretch'
  },
  menuLinkText: {
    color: 'white',
    fontWeight: 600,
    fontSize: 13,
    fontFamily: 'Roboto'
  },
  menuLink: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    borderRight: `1px solid ${theme.palette.primary.dark}`
  }
}

export default withStyles(styles)(Header)
