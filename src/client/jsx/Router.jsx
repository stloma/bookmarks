/* globals fetch, document */

import ReactDOM from 'react-dom';
import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Redirect, Switch, withRouter } from 'react-router-dom';

import App from './App';
import Navigation from './Navigation';
import Footer from './Footer';
import AddBookmark from './AddBookmark';
import Login from './Login';
import Register from './Register';
import Loading from './Loading';
import EditBookmark from './EditBookmark';

function isAuthenticated(cb) {
  const fetchOptions = {
    method: 'GET',
    credentials: 'include'
  };
  fetch('/api/protected', fetchOptions)
    .then(response => cb(response.ok));
}

const NoMatch = () => (<div className='container'><h2>Page Not Found</h2></div>);

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
              />
            )}
          />)
        )}
        <Route exact path='/addbookmark' component={AddBookmark} />
        <Route exact path='/editbookmark' component={EditBookmark} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/register' component={Register} />
        <Route path='/deletebookmark/:id' component={App} />
        <Route path='*' component={NoMatch} />
      </Switch>
    );
  }
  return (
    <Switch>
      <Route exact path='/register' component={Register} />
      <Route exact path='/login' component={Login} />
      <Redirect from='*' to='/login' />
    </Switch>
  );
};

Main.propTypes = {
  loggedIn: PropTypes.bool.isRequired
};

class Container extends React.Component {
  constructor() {
    super();
    this.state = {
      showTags: false,
      showSearch: false,
      loggedIn: false,
      notifications: '',
      loading: true
    };
  }

  componentDidMount() {
    isAuthenticated((loggedIn) => {
      if (loggedIn) {
        this.setState({ loggedIn: true, loading: false });
      } else {
        this.setState({ loggedIn: false, loading: false });
      }
    });
  }

  loadingToggle = () => {
    this.setState({ loading: !this.state.loading });
  }

  tagsToggle = () => {
    this.setState({ showSearch: false });
    this.setState({ showTags: !this.state.showTags });
  }

  searchToggle = () => {
    this.setState({ showTags: false });
    this.setState({ showSearch: !this.state.showSearch });
  }

  render() {
    const { history } = this.props;

    if (this.state.loading) { return <Loading />; }
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
          loadingToggle={this.loadingToggle}
          showTags={this.state.showTags}
          showSearch={this.state.showSearch}
          searchToggle={this.searchToggle}
          tagsToggle={this.tagsToggle}
          history={history}
        />
        <Footer />
      </div>
    );
  }
}

Container.propTypes = {
  history: PropTypes.object.isRequired
};

const ContainerWithRouter = withRouter(Container);
const contentNode = document.querySelector('#root');

ReactDOM.render(<Router><ContainerWithRouter /></Router>, contentNode);

if (module.hot) {
  module.hot.accept();
}
