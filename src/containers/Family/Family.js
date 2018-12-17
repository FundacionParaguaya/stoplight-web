import React from 'react'
import './styles.css'

const Family = ({ familyData, surveys }) => {
  return (
    <div>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Family</h1>
      </div>
      <div className="questions">
        {Object.keys(familyData).map(field => (
          <p key={familyData.code + field}>{field}</p>
        ))}
      </div>
      <div className="answers">
        <p>{familyData.code}</p>
        <p>{familyData.user.username}</p>
        <p>{familyData.name}</p>
        <p>{familyData.country || 'NA'}</p>
        <p>{familyData.organization.code || 'NA'}</p>
        <p>{familyData.snapShotList || 'NA'}</p>
        <p>{familyData.countFamilyMembers}</p>
        {familyData.familyMemberDTOList.map((member, i) => (
          <div key={familyData.code + member.firstName + i}>
            <p>{member.firstName}</p>
            <p>{member.gender}</p>
            <p>{member.birthDate}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Family
