import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import App from './App.jsx'
import { Navigation } from './Navigation.jsx'
import { Footer } from './Footer.jsx'
import AddBookmark from './AddBookmark.jsx'

const contentNode = document.querySelector('#root')
const NoMatch = () => <p>Page Not Found</p>

const Main = () => (
  <Switch>
    <Route exact path='/' component={App} />
    <Route exact path='/addbookmark' component={AddBookmark} />
    <Route path='/deletebookmark/:id' component={App} />
    <Route path='*' component={NoMatch} />
  </Switch>
)

const Container = () => (
  <div>
    <Navigation />
    <Main />
    <Footer />
  </div>
)

ReactDOM.render(<Router><Container /></Router>, contentNode)

if (module.hot) {
  module.hot.accept()
}
