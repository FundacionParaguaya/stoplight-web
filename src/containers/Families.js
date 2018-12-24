import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { Link } from 'react-router-dom'
// import ReactTable from 'react-table'
import BootstrapTable from 'react-bootstrap-table-next'

import { loadFamilies } from '../redux/actions'

import Spinner from '../components/Spinner'

import 'react-table/react-table.css'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'

function link(cell, row) {
  return <Link to={`/family/${row.familyId}`}>{cell}</Link>
}

/**
 * @namespace
 * Displays information about families belonging to an organization or hub
 * @extends Component
 */
class Families extends Component {

  constructor(){
    super()
    this.state = {
      columns: [
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
          dataField: 'snapshotList.length',
          text: 'Snapshots',
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

    }
  }
  componentDidMount() {
    this.loadData()
  }

  /**
    * Loads all the Family data from the reducer
    * @return {Array} returns the list of families from the backend
    * prepares the data to fill the `columns` parameter defines the columns to be displayed & used by ReactTable
    * Fields:
    ** {string}  code
    ** {string}  name family  name
    ** {array}  familyMemberDTOList the list of family members, where we take the length to get the **number of family members**
    ** {array}  snapshotList the list of snapshots, where we take the length to get the **number of snapshots**
    ** {object} user object of the survey taker (mentor)
    * @type {Array}
  */
  loadData() {
    this.props.loadFamilies()
  }

  /**
   * Processes the data returned by {@link Families.loadData}
   ** extracts the `mentor` name from the user object
   ** converts the dates from timestamp to DD MMM YYY format (e.g. 01 Jan 2018)
   * @param  {Array} familyList Family Array to process
   * @return {Array} familyList List of prcoessed families
   */
  processFamilies(familyList) {
    return familyList.map(family => {
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
    let loaded = data.length > 0 ? true : false

    return (
      <div>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h1 className="h2">Families</h1>
        </div>
        <div className="table-responsive">
          {loaded ? (
            <BootstrapTable
              bootstrap4={true}
              loading={true}
              keyField="familyId"
              data={data}
              columns={this.state.columns}
            />
          ) : (
            <Spinner />
          )}
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
