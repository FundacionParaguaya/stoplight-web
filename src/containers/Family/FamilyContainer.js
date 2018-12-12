import React, { Component } from 'react'
import { connect } from 'react-redux'
import { loadFamilies } from '../../redux/actions'
import Family from './Family'

class FamilyContainer extends Component {
  componentDidMount() {
    this.loadData()
  }

  loadData = () => {
    this.props.loadFamilies()
  }

  render() {
    const singleFamily =
      this.props.families.familiesNewStructure &&
      this.props.families.familiesNewStructure.filter(
        family => family.code === this.props.match.params.id
      )
    return (
      <div>
        {singleFamily && (
          <Family
            familyData={singleFamily[0]}
            surveyData={this.props.surveys}
          />
        )}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  families: state.families,
  surveys: state.surveys
})

const mapDispatchToProps = {
  loadFamilies
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FamilyContainer)
