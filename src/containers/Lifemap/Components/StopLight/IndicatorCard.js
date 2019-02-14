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
      : { maxWidth: '100%', height: '400px'}
  return (
    <div>
      <div>{imagesLoaded !== 3 ? <Spinner /> : <div />}</div>
      <div className={cardClass} style={imgStyle} >
        <div className="card-body" >
          <img src={url} className="img-fluid" alt="" onLoad={() => cardImageLoaded()} />
          <div style={{marginTop: '1em'}}><p >{description}</p></div>
      </div>
    </div>
    </div>
  )
}

export default IndicatorCard
