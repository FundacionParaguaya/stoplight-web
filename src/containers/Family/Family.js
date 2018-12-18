import React from 'react'
import { User } from 'react-feather'
import moment from 'moment'

import './styles.css'

const Family = ({ familyData, surveys }) => {
  Object.keys(familyData).map(field => console.log(field))
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
                  <b>{familyData.name}</b>
                </h5>
                <p className="mb-1">
                  <b>Code: </b>
                  {familyData.code}
                </p>
                <p className="mb-1">
                  <b>Address: </b>
                  {familyData.address ? familyData.address : '-'}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-md-6">
          <div className="card">
            <div className="card-body">
              <h4 className="header-title mb-3">Participant Information</h4>
              <div className="text-center">
                <h5>
                  <b>
                    {familyData.person.firstName} {familyData.person.lastName}
                  </b>
                </h5>
                <p className="mb-1">
                  <b>Phone: </b>
                  {familyData.person.phoneNumber}
                </p>
                <p className="mb-1">
                  <b>Email: </b>
                  {familyData.person.email}
                </p>
                <p className="mb-1">
                  <b>Gender: </b>
                  {familyData.person.gender}
                </p>
                <p className="mb-1">
                  <b>Date of Birth: </b>
                  {familyData.person.birthdate}
                </p>
                <p className="mb-1">
                  <b>Country of Birth: </b>
                  {familyData.person.countryOfBirth.country}
                </p>
                <p className="mb-1">
                  <b>ID Type: </b>
                  {familyData.person.identificationType}
                </p>
                <p className="mb-1">
                  <b>ID Number: </b>
                  {familyData.person.identificationNumber}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-12">
          <div class="card">
            <div class="card-body">
              <h4 class="header-title mb-3">Family Members</h4>
              {familyData.familyMemberDTOList.length === 0 ? (
                'No family members'
              ) : (
                <div class="table-responsive">
                  <table class="table mb-0">
                    <thead class="thead-light">
                      <tr>
                        <th>Name</th>
                        <th>Date of Birth</th>
                        <th>Gender</th>
                      </tr>
                    </thead>
                    <tbody>
                      {familyData.familyMemberDTOList.map(m => (
                        <tr>
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

export default Family
