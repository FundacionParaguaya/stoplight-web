import React from 'react'
import Spinner from '../../../../components/Spinner'

const IndicatorCard = ({
  url,
  description,
  cardClass,
  cardImageLoaded,
  imagesLoaded
}) => {
  let imgStyle =
    imagesLoaded !== 3
      ? { display: 'none', maxWidth: '100%' }
      : { maxWidth: '100%' }
  return (
    <div>
      <div>{imagesLoaded !== 3 ? <Spinner /> : <div />}</div>
      <div className={cardClass} style={imgStyle}>
        <div className="card-body">
          <img src={url} alt="" onLoad={() => cardImageLoaded()} />
        </div>
        <div className="card-footer">{description}</div>
      </div>
    </div>
  )
}

export default IndicatorCard
