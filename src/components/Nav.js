import React from 'react'
import icon_stoplight from '../assets/icon_stoplight.png'

const Nav = props => {
  return (
    <div >
      <nav className="navbar navbar-expand-lg navbar-expand-md navbar-expand-sm ">
      <ul className="navbar-nav povstop-logo-nav">
      <li className="nav-item " >
        <a className="nav-link" href="#"><img src={icon_stoplight} height="42px"/></a>
      </li>
      </ul>
      <ul className="navbar-nav">
      <li className="nav-item " >
        <a className="nav-link" href="#" >Surveys </a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="#">Households</a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="#">Map</a>
      </li>
    </ul>
      </nav>
    </div>

  )
}

export default Nav
