import React, { Component } from 'react'
import PropTypes from 'prop-types'

class LifemapListItem extends Component {
  render() {
    return (
      <div>
        <p>{this.props.name}</p>
        <button onClick={() => this.props.handleClick}> clickMe</button>
      </div>
    )
  }
}

LifemapListItem.propTypes = {
  name: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired
}

export default LifemapListItem
