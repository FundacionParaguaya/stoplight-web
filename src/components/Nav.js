import React from 'react'
import icon_stoplight from '../assets/icon_stoplight.png'
import { connect } from 'react-redux'

const Nav = props => {
  let env = props.user.env
  if(env === "test"){
    env = "testing"
  }
  let envUrl = `https://${env}.povertystoplight.org`
  return (
    <div >
      <nav className="navbar navbar-expand-lg navbar-expand-md navbar-expand-sm ">
      <ul className="navbar-nav povstop-logo-nav">
      <li className="nav-item " >
        <a className="nav-link" href={`${envUrl}`}><img src={icon_stoplight} height="42px"/></a>
      </li>
      </ul>
      <ul className="navbar-nav">
      <li className="nav-item " >
        <a className="nav-link" href={`${envUrl}/#surveys`} >Surveys </a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href={`${envUrl}/#families`}>Households</a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href={`${envUrl}/#map`}>Map</a>
      </li>
    </ul>
    <ul class="nav navbar-nav ml-auto">
    <li className="nav-item">
      <a className="nav-link" href={`https://intercom.help/poverty-stoplight`} target="__blank">FAQ</a>
    </li>
    </ul>
      </nav>
    </div>

  )
}

const mapStateToProps = ({ user }) => ({
  user
})

export default connect(mapStateToProps)(Nav)
