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
      <Route path="login" component={ Login } />
      <Route path="logout" component={ Logout } />
      <Route path="recipes" component={ RecipeListContainer }>
        <Route path="all" recipesBatch= { all } component={ RecipeListContainer }/>
        <Route path="current" recipesBatch= { current } component={ RecipeListContainer }/>
        <Route path="mine" recipesBatch= { mine } component={ RecipeListContainer}/>
      </Route>
      <Route path="recipe" component={ RecipeContainer }>
        <Route path=":recipeId" component={ RecipeContainer }/>
      </Route>
      <Route path="admin" component={ AdminBox }>
        <Route path="edit_recipe" component={ EditRecipeContainer }>
          <Route path=":recipeId" component={ EditRecipeContainer }/>
        </Route>
        <Route path="users" component={ UsersListContainer }>
          <Route path="new" component={ NewUserContainer }/>
          <Route path=":userId" component={ UserContainer }/>
          <Route path="edit_user" component={ EditUserContainer }>
            <Route path=":userId" component={ EditUserContainer }/>
          </Route>
        </Route>
      </Route>
    </Route>
  </Router>
), document.getElementById('ccbrecipe_app'));
