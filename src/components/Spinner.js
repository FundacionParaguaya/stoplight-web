import React from 'react'
import { Loader } from 'react-feather'

const Spinner = props => {
  return (
    <div className="center">
      <Loader className="spin feather x3 m64" />
    </div>
  )
}

export default Spinner
