const mongoose = require('mongoose');

var recipeSchema = new mongoose.Schema({
  name: String,
  creatorId: String
});

module.exports = mongoose.model('Recipe', recipeSchema);
