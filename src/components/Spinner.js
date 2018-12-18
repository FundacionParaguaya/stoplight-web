import React from 'react'
import {Loader} from 'react-feather';

const Spinner = props => {
  return (
    <div className="center">
      <Loader className="spin" />
    </div>
  )
}

export default Spinner
