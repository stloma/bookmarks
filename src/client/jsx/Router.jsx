/* globals fetch */

import ReactDOM from 'react-dom'
import React from 'react'
import { BrowserRouter as Router, Route, Switch, withRouter } from 'react-router-dom'

import App from './App.jsx'
import { Navigation } from './Navigation.jsx'
import { Footer } from './Footer.jsx'
import AddBookmark from './AddBookmark.jsx'
import Login from './Login.jsx'
import Register from './Register.jsx'
import { Loading } from './Loading.jsx'
import EditBookmark from './EditBookmark.jsx'

  /*
const AuthNotifier = (props) => {
  console.log('auth notifier: ' + props.loggedIn)
  if (props.loggedIn) {
    return (
      <div className='auth-notifier'>Welcome</div>
    )
  }
  return <div>Please log in</div>
}
*/

function isAuthenticated (cb) {
  let fetchOptions = {
    method: 'GET',
    credentials: 'include'
  }
  fetch('/api/protected', fetchOptions)
    .then(response => {
      cb(response.ok)
    })
}

const Main = (props) => {
  if (props.loggedIn) {
    return (
      <Switch>
        <Route exact path='/' render={() => (
          <App
            showSearch={props.showSearch}
            showTags={props.showTags}
            history={props.history}
            showSearchFn={props.showSearchFn}
            showTagsFn={props.showTagsFn}
          />
        )} />
        <Route exact path='/addbookmark' component={AddBookmark} />
        <Route exact path='/editbookmark' component={EditBookmark} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/register' component={Register} />
        <Route path='/deletebookmark/:id' component={App} />
        <Route path='*' component={NoMatch} />
      </Switch>
    )
  }
  return (
    <Switch>
      <Route exact path='/register' component={Register} />
      <Route path='*' component={Login} />
    </Switch>
  )
}

class Container extends React.Component {
  constructor () {
    super()
    this.state = {
      showTags: false,
      showSearch: false,
      loggedIn: false,
      loading: true
    }
    this.showTags = this.showTags.bind(this)
    this.showSearch = this.showSearch.bind(this)
  }

    /*
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  }
  */

  componentDidMount () {
    isAuthenticated((loggedIn) => {
      if (loggedIn) {
        this.setState({ loggedIn: true })
        console.log('logged in')
      } else {
        this.setState({ loggedIn: false })
      }
      setTimeout(function () { this.setState({ loading: false }) }.bind(this), 1000)
    })
  }

  showTags () {
    this.setState({ showSearch: false })
    this.setState({ showTags: !this.state.showTags })
  }

  showSearch () {
    this.setState({ showTags: false })
    this.setState({ showSearch: !this.state.showSearch })
  }

  render () {
    const { history, location } = this.props

    if (this.state.loading) { return <Loading /> }
    return (
      <div>
        <Navigation
          showTags={this.showTags}
          showSearch={this.showSearch}
          disableTagsLink={this.state.showTags}
          disableSearchLink={this.state.showSearch}
          loggedIn={this.state.loggedIn}
        />
        <Main
          loggedIn={this.state.loggedIn}
          showTags={this.state.showTags}
          showSearch={this.state.showSearch}
          showSearchFn={this.showSearch}
          showTagsFn={this.showTags}
          history={history}
          location={location}
          />
        <Footer />
      </div>
    )
  }
}
// const { from } = this.props.location.state || { from: { pathname: '/' } }

const ContainerWithRouter = withRouter(Container)
const contentNode = document.querySelector('#root')

const NoMatch = () => (<div className='container'><h2>Page Not Found</h2></div>)

ReactDOM.render(<Router><ContainerWithRouter /></Router>, contentNode)

if (module.hot) {
  module.hot.accept()
}
