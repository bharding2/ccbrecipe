const React = require('react');
const ReactDOM = require('react-dom');

const Router = require('react-router').Router;
const Route = require('react-router').Route;
const Link = require('react-router').Link;
const browserHistory = require('react-router').browserHistory;
const withRouter = require('react-router').withRouter;

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
    </Route>
  </Router>
), document.getElementById('ccbrecipe_app'));
