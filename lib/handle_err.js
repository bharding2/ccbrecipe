module.exports = function(err, res) {
  console.log(err);
  res.status(500).json({ msg: 'server errored' });
};

// var HandleErr = module.exports = function(message, status, resMessage) {
//   Error.call(this);
//   this.message = message;
//   this.status = status;
//   this.resMessage = resMessage;
// };
//
// HandleErr.prototype = Object.create(Error.prototype);
//
// HandleErr.prototype.respond = function(res) {
//   res.status(this.status).json({ msg: this.message });
// };
//
// HandleErr.isHandleError = function(err) {
//   return err instanceof HandleErr;
// };
//
// HandleErr.err400 = function(message) {
//   return new HandleErr(message, 400, 'bad request');
// };
//
// HandleErr.err404 = function(message) {
//   return new HandleErr(message, 404, 'not found');
// };
//
// HandleErr.err500 = function(message) {
//   return new HandleErr(message, 500, 'internal server error');
// };
