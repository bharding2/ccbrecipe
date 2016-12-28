const React = require('react');
const ReactDOM = require('react-dom');

// api_url standin
var apiUrl = process.env.API_URL;

const RecipeBox = React.createClass({
  render: function() {
    return (
      <div>
        <p>{ this.props.url }</p>
      </div>
    );
  }
});

ReactDOM.render(
  <RecipeBox url={ apiUrl } />,
  document.getElementById('ccbrecipe_app')
);
