import React from 'react'
import './styles.css'

const Family = ({ familyData, surveys }) => {
  console.log(familyData)
  console.log(surveys)
  return (
    <div className="container">
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
