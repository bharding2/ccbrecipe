const mongoose = require('mongoose');

module.exports = function(connection) {
  var recipeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    creatorId: String,
    currentMenu: Boolean,
    category: String,
    ingredients: [],
    steps: [],
    totalYield: String
  });

  return connection.model('Recipe', recipeSchema);
};
