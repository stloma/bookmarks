import React from 'react'
import Search from './Search'
import Card from './Card'

class ShowCards extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      searchTerm: ''
    }
  this.handleSearchTermChange  = this.handleSearchTermChange.bind(this)
  }
   handleSearchTermChange (event) {
    this.setState({searchTerm: event.target.value})
  }
  render () {
    let loggedIn = true
    if (loggedIn) {
      return (
       <div>
       <div className="container">
       <Search handleSearchTermChange={this.handleSearchTermChange} />
       </div>
              {this.props.data
                .filter((site) =>
                  `${site.title}`.indexOf(this.state.searchTerm) >= 0)
                .map(site => {
                  return (
                   <Card {...site} />
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
}

export default ShowCards