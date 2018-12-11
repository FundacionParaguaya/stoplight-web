import React, { Component } from "react";
import { connect } from "react-redux";
import { loadFamilies } from "../redux/actions";
import FamilyMemberTable from "../components/FamilyMemberTable"
import SnapshotTable from "../components/SnapshotTable"
import ReactTable from "react-table";
import "react-table/react-table.css";
import moment from "moment";
const columns = [
  {
    Header: "Code",
    accessor: "code"
  },
  {
    Header: "Name",
    accessor: "name"
  },
  {
    Header: "Family Members",
    accessor: `familyMemberDTOList.length`
  },
  {
    Header: "Snapshots",
    accessor: `snapshotList.length`
  },
  {
    Header: "Latest Snapshot",
    accessor: 'latestSnapshot',
  },
  {
    Header: "Org",
    accessor: "organization"
  },
  {
    Header: "Mentor",
    accessor: "mentor"
  }
];


class Families extends Component {
  constructor(props) {
    super(props);
    this.state = {
      families: this.props.families
    };
  }
  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    this.props.loadFamilies();
  };

  processFamilies(processFamilies) {
    return processFamilies.map(family => {
      family.mentor = family.user.username;
      family.organization = family.organization.code;
      family.latestSnapshot = family.snapshotList.length > 0 ? moment.unix(
        Math.max.apply(Math, family.snapshotList.map(function(o) { return o.createdAt; }))/1000
      )
      .format("DD MMM YYYY")
      .toString() : null
      return family;
    });
  }

  // generateFamilyRows(families){
  //   return this.state.families
  // }

  render() {
    let data = this.props.families
      ? this.processFamilies(this.props.families)
      : [];
    console.log(data);
    return (
      <div className="container">
        <ReactTable
          className="-striped -highlight"
          filterable={true}
          data={data}
          columns={columns}
          SubComponent={row => {
            console.log(row);
            if (row.original.countFamilyMembers) {
              return (
                <div>
                  <SnapshotTable
                  data={row.original.snapshotList}
                  />
                  <hr />
                  <FamilyMemberTable
                  data={row.original.familyMemberDTOList}
                  />
                </div>
              );
            }
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  // stateObject: state,
  families: state.families.familiesNewStructure
});

const mapDispatchToProps = {
  loadFamilies
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Families);
// const mapStateToProps = props => {
//   families
// }
//
// const mapDispatchToProps = ({ fetchFamilies }) =>{
//
// }
//
// export default (Family = connect(mapStateToProps)(Family))
