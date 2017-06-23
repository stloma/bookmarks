import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { BrowserRouter as Router, Route, Switch, withRouter } from 'react-router-dom'

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
      <Route path='/deletebookmark/:id' component={App} />
      <Route path='*' component={NoMatch} />
    </Switch>
  )
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
    location: PropTypes.object.isRequired,
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
        <Navigation showTags={this.showTags} showSearch={this.showSearch} />
        <Main showTags={this.state.showTags} showSearch={this.state.showSearch} history={history} />
        <Footer />
      </div>
    )
  }
}

const ContainerWithRouter = withRouter(Container)

ReactDOM.render(<Router><ContainerWithRouter /></Router>, contentNode)

if (module.hot) {
  module.hot.accept()
}
