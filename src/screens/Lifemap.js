import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import Terms from './Terms'

class Lifemap extends Component {
  render() {
    return (
      <div>
        <p>Lifemap</p>
        <Route path={`${this.props.match.path}/terms`} component={Terms} />
      </div>
    )
  }
}

export default Lifemap
