import React, { Component } from 'react'


class IndicatorList extends Component {
  // get this.props.surveys passed in

  render(){
    let draft = this.props.drafts.filter(draft => draft.id = this.props.draftId)[0]
    let indicatorList = draft.indicator_survey_data
    return (
      <div>
      <ul class="list-group">
      {indicatorList.map((indicator)=>{
        return (
          <li class="list-group-item">indicator.</li>
        )
      })}
      </ul>
      </div>
    )
  }
}

export default IndicatorList
