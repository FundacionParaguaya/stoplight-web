import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { Link } from 'react-router-dom'
// import ReactTable from 'react-table'
import BootstrapTable from 'react-bootstrap-table-next'

import { loadFamilies } from '../redux/actions'

import Spinner from '../components/Spinner'

import 'react-table/react-table.css'

function link(cell, row) {
  return <Link to={`/family/${row.familyId}`}>{cell}</Link>
}

const columns = [
  {
    dataField: 'code',
    text: 'Code',
    sort: true,
    formatter: link
  },
  {
    dataField: 'name',
    text: 'Name',
    sort: true
  },
  {
    dataField: 'familyMemberDTOList.length',
    text: 'Family Members',
    sort: true
  },
  {
    dataField: 'organization.name',
    text: 'Org',
    sort: true
  },
  {
    dataField: 'mentor',
    text: 'Mentor',
    sort: true
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
    let loaded = data.length > 0 ? true : false;

    return (
      <div>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h1 className="h2">Families</h1>
        </div>
        <div className="table-responsive">

          {
            loaded
              ? (
                  <BootstrapTable
                  bootstrap4={true}
                  loading={true}
                  keyField="familyId"
                  data={data}
                  columns={columns}
                />
              )
              : (
                <Spinner />
              )
          }
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
