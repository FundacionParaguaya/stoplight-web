import React, { Component } from 'react'
import { connect } from 'react-redux'
import { loadFamilies } from '../redux/actions'
import ReactTable from 'react-table'
import 'react-table/react-table.css'

const columns = [{
  Header:'Code',
  accessor:'code'
}, {
  Header:'Name',
  accessor: 'name',
},{
  Header:'Org',
  accessor:'organization'
},{
  Header:'Family Members',
  accessor: `familyMemberDTOList.length`
}]

const familyColumns = [
  {
    Header:'First Name',
    accessor:'firstName'
  }, {
    Header:'Gender',
    accessor: 'gender',
  },{
    Header:'birthDate',
    accessor:'birthDate'
  }
]

 class Family extends Component{

   constructor(props){
     super(props)
     this.state={
       families:this.props.families
     }
   }
    componentDidMount(){
      this.loadData()
    }

  loadData=()=>{
    this.props.loadFamilies()

  }

  processFamilies(processFamilies){

    return processFamilies.map((family) => {
      family.organization = family.organization.code
      return family
    })


  }

  // generateFamilyRows(families){
  //   return this.state.families
  // }

  render(){

    let data = this.props.families ? this.processFamilies(this.props.families) : []

    return (
      <div className="container">
        <ReactTable
          className="-striped -highlight"
          filterable={true}
          data={data}
          columns={columns}
          SubComponent={row => {

            console.log(row)
            if(row.original.countFamilyMembers){
            return(
              <ReactTable
                className="-striped -highlight"
                data={row.original.familyMemberDTOList}
                defaultPageSize={row.original.familyMemberDTOList.length <= 3 ? row.original.familyMemberDTOList.length : 3}
                columns={familyColumns}
                />
            )}
          }}
        />
      </div>
    )
  }
}


const mapStateToProps = state => ({
  // stateObject: state,
  families:state.families.familiesNewStructure
})

const mapDispatchToProps = {
  loadFamilies
}

export default connect(
  mapStateToProps,
   mapDispatchToProps
)(Family)
// const mapStateToProps = props => {
//   families
// }
//
// const mapDispatchToProps = ({ fetchFamilies }) =>{
//
// }
//
// export default (Family = connect(mapStateToProps)(Family))
