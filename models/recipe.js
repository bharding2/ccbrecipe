const mongoose = require('mongoose');

module.exports = function(connection) {
  var recipeSchema = new mongoose.Schema({
    name: String,
    creatorId: String,
    current: Boolean
  });

  return connection.model('Recipe', recipeSchema);
};
