import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class Terms extends Component {
  constructor(props) {
    super(props)
    this.state = {
      step: 1,
      terms: false
    }
  }
  render() {
    return (
      <div style={{ marginTop: 50 }}>
        <div className="jumbotron">
          <h1 className="display-3">Terms & Conditions</h1>
          <p className="lead">{this.props.data.title}</p>
          <hr className="my-4" />
          <p>{this.props.data.text}</p>
          <p className="lead">
            <button
              className="btn btn-primary btn-lg"
              href="#"
              onClick={() => this.props.nextStep()}
            >
              Agree
            </button>
            <Link to={`/`}>
              <button className="btn btn-primary btn-lg" href="#">
                Disagree
              </button>
            </Link>
          </p>
        </div>
      </div>
    )
  }
}

export default Terms
