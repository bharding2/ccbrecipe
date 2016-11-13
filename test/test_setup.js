process.env.MONGODB_URI = 'mongodb://localhost/ccbrecipe_testDB';
const mongoose = require('mongoose');
const port = process.env.PORT = 5050;
const server = require(__dirname + '/../server');

module.exports = exports = (cb) => {
  var conn = mongoose.createConnection(process.env.MONGODB_URI);
  server.listen(port, () => {
    console.log('server up on port: ' + port);
    return cb(conn);
  });
};
