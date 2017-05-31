import React from 'react'

const Landing = (props) => {
  let loggedIn = true
  console.log(props.data)

  if (loggedIn) {
    return (
     <div>
            {props.data
              .map(site => {
                return (
                 site.title
                )
              })}
          </div>
          )
  }
  else {
    return (
        <div className="jumbotron">
          <h1>Welcome</h1>
          <p className="lead">Please login or register to continue to the site</p>
          <a className="btn btn-lg btn-success" href="#" role="button">Register</a> |
          <a className="btn btn-lg btn-warning" href="#" role="button">Login</a>
        </div>
      )
  }
}

export default Landing