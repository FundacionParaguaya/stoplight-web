import React from 'react'

const Nav = props => {
  return (
    <div >
      <nav className="navbar navbar-expand-lg ">
      <ul className="navbar-nav">
      <li className="nav-item active" >
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
