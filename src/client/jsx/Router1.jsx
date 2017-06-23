import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { BrowserRouter as Router, Redirect, Route, Switch, withRouter } from 'react-router-dom'

import App from './App.jsx'
import { Navigation } from './Navigation.jsx'
import { Footer } from './Footer.jsx'
import AddBookmark from './AddBookmark.jsx'
import Login from './Login.jsx'
import Register from './Register.jsx'

const contentNode = document.querySelector('#root')
const NoMatch = () => (<div className='container'><h2>Page Not Found</h2></div>)

const Main = (props) => {
  return (
    <Switch>
      <div>
      <Route exact path='/' render={() => (
        <App
          showSearch={props.showSearch}
          showTags={props.showTags}
          history={props.history}
        />)}
      />
      <Route exact path='/addbookmark' component={AddBookmark} />
      <Route exact path='/login' component={Login} />
      <Route exact path='/register' component={Register} />
      <Route exact path='/login1' component={Login1} />
      <Route path='/deletebookmark/:id' component={App} />
      <AuthRequired exact path='/protected' component={App} />
      <Route path='*' component={NoMatch} />
    </div>
    </Switch>
  )
}

const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb) {
    console.log('authenticate')
    this.isAuthenticated = true
  },
  signout(cb) {
    this.isAuthenticated = false
  }
}

const AuthButton = withRouter(({ history }) => (
  fakeAuth.isAuthenticated ? (
    <p>
      Welcome! <button onClick={() => {
        fakeAuth.signout(() => history.push('/'))
      }}>Sign out</button>
  </p>
  ) : (
    <p>You are not logged in.</p>
  )
))

const AuthRequired = ({ component: Component, ...rest }) => {
  console.log('fakeAuth: ' + fakeAuth.isAuthenticated)
  return (
  <Route {...rest} render={props => (
    fakeAuth.isAuthenticated ? (
      <Component {...props} />
    ) : (
      <Redirect to={{
        pathname: '/login1'
        }}/>
      )
  )}/>
)
}

class Login1 extends React.Component {
  state = {
    redirectToReferrer: false
  }

  login = () => {
    fakeAuth.authenticate(() => {
      this.setState({ redirectToReferrer: true })
    })
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' }}
    const { redirectToReferrer } = this.state

    if (redirectToReferrer) {
      return (
        <Redirect to={from}/>
      )
    }

    return (
      <div>
        <p>You must log in to view the page at { from.pathname }</p>
        <button onClick={this.login}>Log in</button>
      </div>
    )
  }
}

class Container extends React.Component {
  constructor () {
    super()
    this.state = {
      showTags: false,
      showSearch: false
    }
    this.showTags = this.showTags.bind(this)
    this.showSearch = this.showSearch.bind(this)
  }

  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
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
    const { history } = this.props

    return (
      <div>
        <AuthButton />
        <Navigation showTags={this.showTags} showSearch={this.showSearch} />
        <Main showTags={this.state.showTags} showSearch={this.state.showSearch} history={history} />
        <Footer />
      </div>
    )
  }
}

const ContainerWithRouter = withRouter(Container)

ReactDOM.render(<Router>
                  <ContainerWithRouter />
                </Router>, contentNode)

if (module.hot) {
  module.hot.accept()
}
