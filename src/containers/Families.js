import React, { Component } from 'react'
import { connect } from 'react-redux'
import { loadFamilies } from '../redux/actions'
import FamilyMemberTable from '../components/FamilyMemberTable'
import SnapshotTable from '../components/SnapshotTable'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import moment from 'moment'
import { Link } from 'react-router-dom'

const columns = [
  {
    Header: 'Code',
    accessor: 'code'
  },
  {
    Header: 'Name',
    accessor: 'name'
  },
  {
    Header: 'Family Members',
    accessor: `familyMemberDTOList.length`
  },
  {
    Header: 'Snapshots',
    accessor: `snapshotList.length`
  },
  {
    Header: 'Latest Snapshot',
    accessor: 'latestSnapshot'
  },
  {
    Header: 'Org',
    accessor: 'organization'
  },
  {
    Header: 'Mentor',
    accessor: 'mentor'
  }
]

class Families extends Component {
  componentDidMount() {
    this.loadData()
  }

  loadData = () => {
    this.props.loadFamilies()
  }

  processFamilies(processFamilies) {
    return processFamilies.map(family => {
      family.mentor = family.user.username
      family.organization = family.organization.code
      family.latestSnapshot =
        family.snapshotList.length > 0
          ? moment
              .unix(
                Math.max.apply(
                  Math,
                  family.snapshotList.map(function(o) {
                    return o.createdAt
                  })
                ) / 1000
              )
              .format('DD MMM YYYY')
              .toString()
          : null
      return family
    })
  }

  render() {
    let data = this.props.families
      ? this.processFamilies(this.props.families)
      : []
    return (
      <div>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h1 className="h2">Families</h1>
        </div>
        <div className="table-responsive">
          <ReactTable
            className="-striped -highlight"
            filterable={true}
            data={data}
            columns={columns}
            SubComponent={row => {
              if (row.original.countFamilyMembers) {
                return (
                  <div className="padding-bottom= 20px">
                    <SnapshotTable data={row.original.snapshotList} />
                    <hr />
                    <FamilyMemberTable
                      data={row.original.familyMemberDTOList}
                    />
                    <Link to={`/family/${row.original.code}`}>
                      <button
                        class="btn btn-primary btn-sm btn-block"
                        role="button"
                      >
                        See more.
                      </button>
                    </Link>
                  </div>
                )
              }
            }}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  families: state.families.familiesNewStructure
})

const mapDispatchToProps = {
  loadFamilies
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Families)
