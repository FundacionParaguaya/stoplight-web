import React, { Component } from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import logo from './assets/icon_stoplight.png'
import { theme } from './theme'

class Header extends Component {
  render() {
    const { classes, user } = this.props

    return (
      <AppBar className={classes.header} position="fixed">
        <Toolbar className={classes.toolbar} disableGutters={false}>
          <a
            href={`https://${user.env}.povertystoplight.org`}
            className={classes.menuLink}
          >
            <img
              style={{ marginTop: 1 }}
              src={logo}
              alt="Stoplight Logo"
              width={48}
              height={48}
            />
          </a>
          <NavLink
            to={`/surveys?sid=${this.props.user.token}&lang=en`}
            className={classes.menuLink}
          >
            <Typography className={classes.menuLinkText}>Surveys</Typography>
          </NavLink>
          <a
            href={`https://${user.env}.povertystoplight.org/#families`}
            className={classes.menuLink}
          >
            <Typography className={classes.menuLinkText}>Households</Typography>
          </a>
          <a
            href={`https://${user.env}.povertystoplight.org/#map`}
            className={classes.menuLink}
          >
            <Typography className={classes.menuLinkText}>Map</Typography>
          </a>
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
    textDecoration: 'none',
    borderRight: `1px solid ${theme.palette.primary.dark}`
  }
}

const mapStateToProps = ({ user }) => ({ user })

export default withStyles(styles)(
  connect(
    mapStateToProps,
    {}
  )(Header)
)
