import React, { Component } from 'react'
import { connect } from 'react-redux'
import Modal from 'react-modal';

import { addSurveyData, addSurveyDataWhole } from '../../../../redux/actions'
import PrioritiesAchievementsForm from './PrioritiesAchievementsForm'

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

Modal.setAppElement('#root')
class IndicatorList extends Component {
  constructor(props){
    super(props);
    this.state={
      modalIsOpen: false,
      formType: null
    }
    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  openModal(formType) {
    this.setState({modalIsOpen: true, formType: formType});
  }


  closeModal() {
  this.setState({modalIsOpen: false, formType: null});
  }

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
        return {dimension: indicatorGroup.dimension, indicators: indicatorGroup.indicators.map(indicator => {
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
                      onClick={() => this.openModal('priority')}
                    >
                      <span>{indicator.questionText}</span>
                      <span>{indicator.dot}</span>
                    </li>
                  )
                })}
              </ul>
              <br />
              <Modal
                isOpen={this.state.modalIsOpen}
                onRequestClose={this.closeModal}
                style={customStyles}
                contentLabel="Example Modal"
              >

                <h2 ref={subtitle => this.subtitle = subtitle}>{this.state.formType}</h2>
                <PrioritiesAchievementsForm formType={this.state.formType} closeModal={this.closeModal} />
              </Modal>
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
