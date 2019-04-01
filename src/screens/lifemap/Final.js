import React, { Component } from 'react'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import { withTranslation } from 'react-i18next'
import { submitDraft } from '../../api'

export class Final extends Component {
  state = {
    loading: false,
    error: false
  }
  handleSubmit = () => {
    this.setState({
      loading: true
    })

    // submit draft to server and wait for response
    submitDraft(this.props.user, this.props.currentDraft)
      .then(response => {
        if (response.status === 200) {
          this.props.history.push(
            `/surveys?sid=${this.props.user.token}&lang=en`
          )
        }
      })
      .catch(error =>
        this.setState({
          error: error.message,
          loading: false
        })
      )
  }
  render() {
    const { classes, t } = this.props
    const { error } = this.state

    return (
      <div>
        <div className={classes.container}>
          <Typography variant="h2" gutterBottom>
            {t('views.lifemap.great')}
          </Typography>
          <Typography variant="h4" gutterBottom>
            {t('views.lifemap.youHaveCompletedTheLifemap')}
          </Typography>
          {error && <Typography color="error">{error}</Typography>}
          {this.state.loading ? (
            <CircularProgress size={50} thickness={2} />
          ) : (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={this.handleSubmit}
            >
              {t('general.close')}
            </Button>
          )}
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ currentDraft, user }) => ({ currentDraft, user })

const styles = {
  container: {
    marginTop: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  }
}

export default withStyles(styles)(
  connect(
    mapStateToProps,
    {}
  )(withTranslation()(Final))
)
