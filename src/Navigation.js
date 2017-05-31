import React from 'react'
import { Link } from 'react-router-dom'

const Navigation = () => {
  return (
        <div className="navbar navbar-default navbar-fixed-top">
      <div className="container-fluid">
        <div className="navbar-header">
          <a href="../" className="navbar-brand">Bookmark Flow</a>
          <button className="navbar-toggle" type="button" data-toggle="collapse" data-target="#navbar-main">
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
        </div>
        <div className="navbar-collapse collapse" id="navbar-main">
          <ul className="nav navbar-nav">
            <li>
            </li>
            <li>
              <Link className="btn btn-success" to='/'>Home</Link>
            </li>
            <li>
              <Link className="btn btn-success" to='/login'>Login</Link>
            </li>
            <li>
              <Link className="btn btn-success" to='/content'>Add Site</Link>
            </li>
          </ul>

          <ul className="nav navbar-nav navbar-right">
            <li><a href="http://builtwithbootstrap.com/" target="_blank">Search</a></li>
          </ul>

        </div>
      </div>
    </div>

  )
}

export default Navigation
