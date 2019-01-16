import React, { Component } from 'react'
import { connect } from 'react-redux'
import StopLightPresentational from './StopLightPresentational'

class StopLight extends Component {
  constructor(props) {
    super(props)
    this.state = {
      step: 0,
      answers: []
    }
  }

  nextStep = (index, value) => {
    const { step } = this.state
    let answersCopy = [...this.state.answers]
    answersCopy[index] = value
    this.setState({ answers: answersCopy })
    this.setState({ step: step + 1 })
  }

  previousStep = () => {
    const { step } = this.state
    this.setState({ step: step - 1 })
  }

  render() {
    let stopLightQuestions = this.props.data
    console.log(this.state.answers)
    return (
      <div style={{ marginTop: 50 }}>
        {
          <StopLightPresentational
            data={stopLightQuestions[this.state.step]}
            index={this.state.step}
            total={stopLightQuestions.length}
            nextStep={this.nextStep}
            previousStep={this.previousStep}
          />
        }
      </div>
    )
  }
}

const mapDispatchToProps = {}

export default connect(
  null,
  mapDispatchToProps
)(StopLight)
