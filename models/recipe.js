const mongoose = require('mongoose');

module.exports = function(connection) {
  var recipeSchema = new mongoose.Schema({
    name: String,
    creatorId: String,
    currentMenu: Boolean,
    category: String,
    ingredients: [],
    steps: []
  });

  return connection.model('Recipe', recipeSchema);
};
