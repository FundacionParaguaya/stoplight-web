import React from 'react'
import ReactTable from 'react-table'
import moment from "moment";
const SnapshotTable = props =>{
  const {data} = props
  const columns = [
    {
      Header: "ID",
      accessor: "surveyId"
    },
    {
      Header: "Created At",
      accessor: "createdAt",
      Cell: row => (
        <span>
          {moment
            .unix(row.original.createdAt/1000)
            .format("DD MMM YYYY")
            .toString()}
        </span>
      )
    }
  ];

  return (
    <div>
      <div className="text-center" style={{ paddingTop: "10px" }}>
        <h4> Snapshots </h4>
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

export default SnapshotTable
