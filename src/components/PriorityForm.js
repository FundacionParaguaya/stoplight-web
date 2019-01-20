import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addSurveyData, addSurveyDataWhole } from '../../../../redux/actions'


class PriorityForm extends Component{
  constructor(props){
    super(props)
    this.state = {
      visible: false
    }
  }

  render(){
    return(<div></div>)
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
)(PriorityForm)
