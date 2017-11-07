/* globals fetch, document */

import ReactDOM from 'react-dom'
import React from 'react'
import PropTypes from 'prop-types'
import { BrowserRouter as Router, Route, Redirect, Switch, withRouter } from 'react-router-dom'

import App from './App'
import Navigation from './Navigation'
import Footer from './Footer'
import AddBookmark from './AddBookmark'
import ChangePassword from './ChangePassword'
import Login from './Login'
import Register from './Register'
import Loading from './Loading'
import EditBookmark from './EditBookmark'

function isAuthenticated(cb) {
  const fetchOptions = {
    method: 'GET',
    credentials: 'include'
  }
  fetch('/api/protected', fetchOptions)
    .then(response => cb(response.ok))
}

const NoMatch = () => (<div className='container'><h2>Page Not Found</h2></div>)

const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest)
  return (
    React.createElement(component, finalProps)
  )
}

const PropsRoute = ({ component, ...rest }) => (
  <Route
    {...rest}
    render={routeProps => renderMergedProps(component, routeProps, rest)}
  />
)

const Main = (props) => {
  if (props.loggedIn) {
    return (
      <Switch>
        {['/', '/discover'].map(path =>
          (<Route
            key={path}
            exact
            path={path}
            render={() => (
              <App
                history={props.history}
                searchToggle={props.searchToggle}
                tagsToggle={props.tagsToggle}
                showSearch={props.showSearch}
                showTags={props.showTags}
                alert={props.alert}
                clearFilters={props.clearFilters}
              />
            )}
          />)
        )}
        <PropsRoute exact path='/addbookmark' alert={props.alert} component={AddBookmark} />
        <PropsRoute exact path='/editbookmark' alert={props.alert} component={EditBookmark} />
        <PropsRoute exact path='/login' alert={props.alert} component={Login} />
        <PropsRoute exact path='/changepassword' alert={props.alert} component={ChangePassword} />
        <PropsRoute exact path='/register' alert={props.alert} component={Register} />
        <Route path='/deletebookmark/:id' component={App} />
        <Route path='*' component={NoMatch} />
      </Switch>
    )
  }
  return (
    <Switch>
      <PropsRoute exact path='/register' alert={props.alert} component={Register} />
      <PropsRoute exact path='/login' alert={props.alert} component={Login} />
      <Redirect from='*' to='/login' />
    </Switch>
  )
}

Main.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  alert: PropTypes.func.isRequired
}

class Container extends React.Component {
  constructor() {
    super()
    this.state = {
      showTags: false,
      showSearch: false,
      loggedIn: false,
      alerts: { messages: '', type: '' },
      loading: true
    }
  }

  componentDidMount() {
    isAuthenticated((loggedIn) => {
      if (loggedIn) {
        this.setState({ loggedIn: true, loading: false })
      } else {
        this.setState({ loggedIn: false, loading: false })
      }
    })
  }

  loadingToggle = () => {
    this.setState({ loading: !this.state.loading })
  }

  tagsToggle = () => {
    this.setState({ showSearch: false, showTags: !this.state.showTags })
  }

  searchToggle = () => {
    this.setState({ showTags: false, showSearch: !this.state.showSearch })
  }

  clearFilters = () => {
    this.setState({ showTags: false, showSearch: false })
  }

  clearAlert = (alert) => {
    const alerts = this.state.alerts
    alerts.messages = alerts.messages.filter(message => message !== alert)
    this.setState({ alerts })
  }

  alert = (alerts) => {
    if (!alerts) {
      this.setState({ alerts: { messages: '', type: '' } })
    } else if (alerts.messages instanceof Array) {
      this.setState({ alerts })
    } else {
      const message = alerts
      message.messages = [message.messages]
      this.setState({ alerts: message })
    }
  }

  render() {
    const { history } = this.props

    if (this.state.loading) { return <Loading /> }
    return (
      <div>
        <Navigation
          tagsToggle={this.tagsToggle}
          searchToggle={this.searchToggle}
          disableTagsLink={this.state.showTags}
          disableSearchLink={this.state.showSearch}
          loggedIn={this.state.loggedIn}
          clearAlert={this.clearAlert}
          alerts={this.state.alerts}
          alert={this.alert}
          location={this.props.location}
        />
        <Main
          loggedIn={this.state.loggedIn}
          loadingToggle={this.loadingToggle}
          showTags={this.state.showTags}
          showSearch={this.state.showSearch}
          searchToggle={this.searchToggle}
          tagsToggle={this.tagsToggle}
          history={history}
          alert={this.alert}
          clearFilters={this.clearFilters}
        />
        <Footer />
      </div>
    )
  }
}

Container.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
}

const ContainerWithRouter = withRouter(Container)
const contentNode = document.querySelector('#root')

ReactDOM.render(<Router><ContainerWithRouter /></Router>, contentNode)

if (module.hot) {
  module.hot.accept()
}
