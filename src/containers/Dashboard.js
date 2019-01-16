import React, { Component } from 'react'
import { connect } from 'react-redux'

import './Dashboard.css'
/**
 * Renders the Dashboard
 * @extends Component
 */
class Dashboard extends Component {
  render() {
    console.log(this.props.surveys)
    return (
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Dashboard</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <div className="btn-group mr-2">
            <button className="btn btn-sm btn-outline-secondary">Share</button>
            <button className="btn btn-sm btn-outline-secondary">Export</button>
          </div>
          <button className="btn btn-sm btn-outline-secondary dropdown-toggle">
            <span data-feather="calendar" />
            This week
          </button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  state: state
})

export default (Dashboard = connect(mapStateToProps)(Dashboard))
