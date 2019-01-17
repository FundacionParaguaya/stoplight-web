import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addSurveyData, addSurveyDataWhole } from '../../../../redux/actions'

class FamilyMap extends Component{
  render(){
    return(
      <div>
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
)(FamilyMap)
