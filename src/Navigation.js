import React from 'react'
import { Link } from 'react-router-dom'

const Navigation = (props) => {
  return (
        <div className="navbar navbar-default navbar-fixed-top">
      <div className="container-fluid">
        <div className="navbar-header">
          <Link to='/' className="navbar-brand">Bookmark Flow</Link>
          <button className="navbar-toggle" type="button" data-toggle="collapse" data-target="#navbar-main">
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
        </div>
        <div className="navbar-collapse collapse" id="navbar-main">
          <ul className="nav navbar-nav">
          </ul>

          <ul className="nav navbar-nav navbar-right">
            <li>
              <Link to='/search'>Search</Link>
            </li>
            <li>
              <Link to='/content'>Add Site</Link>
            </li>
            <li>
              <Link to='/login'>Logout</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Navigation
