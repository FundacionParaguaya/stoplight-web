import React from 'react'

const IndicatorCard = ({ url, description, cardClass }) => {
  return (
    <div className={cardClass}>
      <div className="card-body">
        <img src={url} alt="" style={{ maxWidth: '100%' }} />
      </div>
      <div className="card-footer">{description}</div>
    </div>
  )
}

export default IndicatorCard
