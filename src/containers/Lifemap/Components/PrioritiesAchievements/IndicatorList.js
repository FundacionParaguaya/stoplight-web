import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addSurveyData, addSurveyDataWhole } from '../../../../redux/actions'

class IndicatorList extends Component {
  // get this.props.surveys passed in

  // get dimensions from survey

  render() {
    let draft = this.props.drafts.filter(draft => draft.id = this.props.draftId)[0]

    let dimensionList = [
      ...new Set(this.props.data.map(stoplight => stoplight.dimension))
    ]
    let groupedIndicatorList = dimensionList
      .map(dimension => {
        return {
          dimension: dimension,
          indicators: this.props.data.filter(
            stoplight => stoplight.dimension === dimension
          )
        }
      })
      .map(indicatorGroup => {
        return {dimenison: indicatorGroup.dimension, indicators: indicatorGroup.indicators.map(indicator => {
          indicator.answer = draft.indicatorSurveyDataList[indicator.codeName]
          switch (indicator.answer) {
            case 1:
              indicator.dot = "Red"
              break
            case 2:
              indicator.dot = "Yellow"
              break
            case 3:
              indicator.dot = "Green"
              break
            default:
              indicator.dot = "blank"
          }
          return indicator
        })}
      })
    console.log(groupedIndicatorList)

    return (
      <div>
        <h2> Priorities & Achievements </h2>
        <hr />
        {groupedIndicatorList.map(indicatorGroup => {
          return (
            <div key={indicatorGroup.dimension}>
              <h4>{indicatorGroup.dimension}</h4>
              <ul
                style={{ listStyle: 'none' }}
                className="list-group indicator-list"
              >
                {indicatorGroup.indicators.map(indicator => {
                  return (
                    <li
                      style={{
                        justifyContent: 'space-between',
                        display: 'flex'
                      }}
                      key={indicator.codeName}
                      className="list-group-item indicator-list"
                    >
                      <span>{indicator.questionText}</span>
                      <span>{indicator.dot}</span>
                    </li>
                  )
                })}
              </ul>
              <br />
            </div>
          )
        })}
      </div>
    )
  }
}


const mapDispatchToProps = {
  addSurveyData,
  addSurveyDataWhole
}

const mapStateToProps = ({ surveys, drafts }) => ({
  surveys,
  drafts
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IndicatorList)
