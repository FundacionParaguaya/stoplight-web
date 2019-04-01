import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField'
import moment from 'moment'
import { withStyles } from '@material-ui/core/styles'

class DatePicker extends Component {
  onChange = e => {
    // format the text value and send it
    this.props.onChange({
      target: { value: moment.utc(e.target.value).unix() }
    })
  }
  render() {
    const { classes, value } = this.props

    // format either the date from the stored draft, or today

    return (
      <div className={classes.container}>
        <TextField
          label={this.props.label}
          type="date"
          onChange={this.onChange}
          value={
            value
              ? moment.unix(value).format('YYYY-MM-DD')
              : moment().format('YYYY-MM-DD')
          }
          fullWidth
        />
      </div>
    )
  }
}

const styles = {
  container: {
    marginTop: 10,
    marginBottom: 10,
    display: 'flex',
    flexWrap: 'wrap'
  }
}

export default withStyles(styles)(DatePicker)
