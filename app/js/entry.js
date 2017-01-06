const React = require('react');
const ReactDOM = require('react-dom');
const ReactRouter = require('react-router');

const Router = ReactRouter.Router;
const Route = ReactRouter.Route;
const Link = ReactRouter.Link;
const browserHistory = ReactRouter.browserHistory;
const withRouter = ReactRouter.withRouter;

var apiUrl = process.env.API_URL;

const RecipeBox = React.createClass({
  render: function() {
    return (
      <div>
        <p>{ this.props.route.url }</p>
      </div>
    );
  }
});

ReactDOM.render((
  <Router history={ browserHistory }>
    <Route path="/" url={ apiUrl } component={ RecipeBox }>
      <Route path="login" component={Login} />
      <Route path="logout" component={Logout} />
    </Route>
  </Router>
), document.getElementById('ccbrecipe_app'));
