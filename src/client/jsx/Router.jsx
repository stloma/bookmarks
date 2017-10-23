/* globals fetch */

import ReactDOM from 'react-dom'
import React from 'react'
import { BrowserRouter as Router, Route, Redirect, Switch, withRouter } from 'react-router-dom'

import App from './App.jsx'
import { Navigation } from './Navigation.jsx'
import { Footer } from './Footer.jsx'
import AddBookmark from './AddBookmark.jsx'
import Login from './Login.jsx'
import Register from './Register.jsx'
import { Loading } from './Loading.jsx'
import EditBookmark from './EditBookmark.jsx'

function isAuthenticated (cb) {
  let fetchOptions = {
    method: 'GET',
    credentials: 'include'
  }
  fetch('/api/protected', fetchOptions)
    .then(response => cb(response.ok))
}

const Main = (props) => {
  if (props.loggedIn) {
    return (
      <Switch>
        {[ '/', '/discover' ].map(path =>
          <Route key={path} exact path={path} render={() => (
            <App
              history={props.history}
              searchToggle={props.searchToggle}
              tagsToggle={props.tagsToggle}
              showSearch={props.showSearch}
              showTags={props.showTags}
           />
         )} />
        )}
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
      <Route exact path='/login' component={Login} />
      <Redirect from='*' to='/login' />
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
    this.tagsToggle = this.tagsToggle.bind(this)
    this.searchToggle = this.searchToggle.bind(this)
  }

  componentDidMount () {
    isAuthenticated(loggedIn => {
      if (loggedIn) {
        this.setState({ loggedIn: true, loading: false })
      } else {
        this.setState({ loggedIn: false, loading: false })
      }
    })
  }

  tagsToggle () {
    this.setState({ showSearch: false })
    this.setState({ showTags: !this.state.showTags })
  }

  searchToggle () {
    this.setState({ showTags: false })
    this.setState({ showSearch: !this.state.showSearch })
  }

  render () {
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
        />
        <Main
          loggedIn={this.state.loggedIn}
          showTags={this.state.showTags}
          showSearch={this.state.showSearch}
          searchToggle={this.searchToggle}
          tagsToggle={this.tagsToggle}
          history={history}
          />
        <Footer />
      </div>
    )
  }
}

const ContainerWithRouter = withRouter(Container)
const contentNode = document.querySelector('#root')

const NoMatch = () => (<div className='container'><h2>Page Not Found</h2></div>)

ReactDOM.render(<Router><ContainerWithRouter /></Router>, contentNode)

if (module.hot) {
  module.hot.accept()
}
