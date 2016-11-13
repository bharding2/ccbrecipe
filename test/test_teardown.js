var mongoose = require('mongoose');
const server = require(__dirname + '/../server');

module.exports = exports = (conn, cb) => {
  conn.db.dropDatabase(() => {
    mongoose.disconnect(() => {
      server.close(cb);
    });
  });
};
