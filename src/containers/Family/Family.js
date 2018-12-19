import React, { Component } from 'react'
import { User } from 'react-feather'
import moment from 'moment'

import './styles.css'

class Family extends Component {
  render() {
    let participant = this.props.familyData.familyMemberDTOList.find(
      f => f.firstParticipant
    )

    return (
      <div>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h1 className="h2">Family</h1>
        </div>
        <div className="row">
          <div className="col-lg-4 col-md-6">
            <div className="card">
              <div className="card-body">
                <h4 className="header-title mb-3">Family Information</h4>
                <div className="text-center">
                  <User className="feather x2" />
                  <h5>
                    <b>{this.props.familyData.name}</b>
                  </h5>
                  <p className="mb-1">
                    <b>Code: </b>
                    {this.props.familyData.code}
                  </p>
                  <p className="mb-1">
                    <b>Address: </b>
                    {this.props.familyData.address
                      ? this.props.familyData.address
                      : '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {participant ? (
            <div className="col-lg-4 col-md-6">
              <div className="card">
                <div className="card-body">
                  <h4 className="header-title mb-3">Participant Information</h4>
                  <div>
                    <h5>
                      <b>
                        {participant.firstName} {participant.lastName}
                      </b>
                    </h5>
                    <p className="mb-1">
                      <b>Phone: </b>
                      {participant.phoneNumber}
                    </p>
                    <p className="mb-1">
                      <b>Email: </b>
                      {participant.email}
                    </p>
                    <p className="mb-1">
                      <b>Gender: </b>
                      {participant.gender}
                    </p>
                    <p className="mb-1">
                      <b>Date of Birth: </b>
                      {participant.birthDate}
                    </p>
                    <p className="mb-1">
                      <b>Country of Birth: </b>
                      {participant.birthCountry}
                    </p>
                    <p className="mb-1">
                      <b>ID Type: </b>
                      {participant.documentType}
                    </p>
                    <p className="mb-1">
                      <b>ID Number: </b>
                      {participant.documentNumber}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ''
          )}
        </div>

        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <h4 className="header-title mb-3">Family Members</h4>
                {this.props.familyData.familyMemberDTOList.length === 0 ? (
                  'No family members'
                ) : (
                  <div className="table-responsive">
                    <table className="table mb-0">
                      <thead className="thead-light">
                        <tr>
                          <th>Name</th>
                          <th>Date of Birth</th>
                          <th>Gender</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.props.familyData.familyMemberDTOList.map(m => (
                          <tr key={m.id}>
                            <td>
                              {m.firstName} {m.lastName}
                            </td>
                            <td>
                              {moment
                                .unix(m.birthDate)
                                .format('DD MMM YYYY')
                                .toString()}
                            </td>

                            <td>{m.gender}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Family
