import React, { Component } from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { withStyles, withTheme } from '@material-ui/core/styles'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import logo from './assets/icon_stoplight.png'
import { theme } from './theme'
import Button from '@material-ui/core/Button'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grow from '@material-ui/core/Grow'
import Paper from '@material-ui/core/Paper'
import Popper from '@material-ui/core/Popper'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
import { withTranslation } from 'react-i18next'
import i18n from './i18n'
class Header extends Component {
  state = {
    open: false,
    langaugeMenuMain: 'en'
  }
  componentDidMount() {
    if (localStorage.getItem('language') == 'en') {
      this.setState({ langaugeMenuMain: 'en' })
    } else if (localStorage.getItem('language') == 'es') {
      this.setState({ langaugeMenuMain: 'es' })
    }
  }
  handleToggle = () => {
    this.setState(state => ({ open: !state.open }))
  }
  handleCloseAway = () => {
    this.setState({ open: false })
  }
  handleClose = event => {
    localStorage.setItem('language', event)
    i18n.changeLanguage(event)
    this.setState({ open: false, langaugeMenuMain: event })
  }
  render() {
    const { classes, user, t } = this.props
    console.log(this.props)
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
            <Typography className={classes.menuLinkText}>
              {t('views.family.household')}
            </Typography>
          </a>
          <a
            href={`https://${user.env}.povertystoplight.org/#map`}
            className={classes.menuLink}
          >
            <Typography className={classes.menuLinkText}>Map</Typography>
          </a>
          <Button
            style={{ color: 'white' }}
            buttonRef={node => {
              this.anchorEl = node
            }}
            aria-owns={this.state.open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            onClick={this.handleToggle}
          >
            {this.state.langaugeMenuMain == 'en' ? 'English' : 'Español'}

            <i className="material-icons">arrow_drop_down</i>
          </Button>
          <Popper
            open={this.state.open}
            anchorEl={this.anchorEl}
            transition
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                id="menu-list-grow"
                style={{
                  transformOrigin:
                    placement === 'bottom' ? 'center top' : 'center bottom'
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={this.handleCloseAway}>
                    <MenuList>
                      <MenuItem onClick={() => this.handleClose('en')}>
                        English
                      </MenuItem>
                      <MenuItem onClick={() => this.handleClose('es')}>
                        Español
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
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
  )(withTranslation()(Header))
)
