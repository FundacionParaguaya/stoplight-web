import React, { Component } from 'react'
import { Link } from 'react-router-dom'

const navigationRules = {
  terms: {
    nextPage: 'Privacy',
    param: 'privacy'
  },
  privacy: {
    nextPage: 'FamilyParticipant'
  }
}

class Terms extends Component {
  render() {
    console.log(this.props)
    return (
      <div style={{ marginTop: 50 }}>
        <Link to={`/question/${this.props.match.params.id}`}>
          <p>TERMS CONDITIONS click me to continue</p>
        </Link>
      </div>
    )
  }
}

export default Terms
