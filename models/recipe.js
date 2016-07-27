const mongoose = require('mongoose');

module.exports = function(connection) {
  var recipeSchema = new mongoose.Schema({
    name: String,
    creatorId: String,
    currentMenu: Boolean,
    ingredients: []
  });

  return connection.model('Recipe', recipeSchema);
};
