import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchFamilies } from '../redux/actions'
import { Button } from 'react-bootstrap/lib/Button'
import ReactTable from 'react-table'
import 'react-table/react-table.css'

const columns = [{
  Header:'Id',
  accessor:'id'
}, {
  Header:'Name',
  accessor: 'name',
}]

export default class Family extends Component{

  constructor(props){
    super(props)
    // trigger action to get Families from Graphql Interface
    this.state = {
      families: [{
        "id":2,
        "name":"giger"
      }, {
        "id":3,
        "name":"bryan"
      }]
    }
  }



  // generateFamilyRows(families){
  //   return this.state.families
  // }

  render(){
    return (
      <div className="container">
        <ReactTable
          className="-striped -highlight"
          data={this.state.families}
          columns={columns}
        />
      </div>
    )
  }
}


// const mapStateToProps = props => {
//   families
// }
//
// const mapDispatchToProps = ({ fetchFamilies }) =>{
//
// }
//
// export default (Family = connect(mapStateToProps)(Family))
