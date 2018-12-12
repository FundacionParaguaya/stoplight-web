import React from 'react'
import ReactTable from 'react-table'
import moment from "moment";

const FamilyMemberTable = props =>{
  const {data} = props
  const columns = [
    {
      Header: "First Name",
      accessor: "firstName"
    },
    {
      Header: "Gender",
      accessor: "gender"
    },
    {
      Header: "birthDate",
      accessor: "birthDate",
      Cell: row => (
        <span>
          {moment
            .unix(row.original.birthDate)
            .format("DD MMM YYYY")
            .toString()}
        </span>
      )
    }
  ];

  return (
    <div>
      <div className="text-center" style={{ paddingTop: "10px" }}>
        <h4> Family Members </h4>
      </div>

      <ReactTable
        className="-striped -highlight"
        data={data}
        defaultPageSize={
          data.length <= 4
            ? data.length
            : 3
        }
        columns={columns}
      />
    </div>
  )

}

export default FamilyMemberTable
