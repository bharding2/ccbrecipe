const mongoose = require('mongoose');

module.exports = function(connection) {
  var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    roles: [String],
    admin: Boolean
  });

  return connection.model('User', userSchema);
};
