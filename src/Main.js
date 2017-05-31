import React from 'react'
import { render } from 'react-dom'
import {
      BrowserRouter as Router,
      Route,
      Link,
      BroswerHistory,
    Switch
} from 'react-router-dom'

import Navigation from './Navigation'
import LoginForm from './LoginForm'
import Content from './Content'
import Landing from './Landing'

import preload from '../data/data.json'

const Main = () => (
  <div>
    <Switch>
      <Route exact path='/' component={(props) => <Landing data={preload.sites} />} />
      <Route exact path='/login' component={LoginForm}/>
      <Route path='/content' component={Content}/>
    </Switch>
  </div>
)

const Container = () => {
	return ( <div><Navigation /><Main /></div> )
}

render(
        <Router>
          <Container />
        </Router>,
    document.getElementById('root')
    );
