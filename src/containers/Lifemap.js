import React, { Component } from 'react'
import { connect } from 'react-redux'

class Lifemap extends Component {
  render() {
    return (
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Lifemap</h1>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  state: state
})

export default (Lifemap = connect(mapStateToProps)(Lifemap))
