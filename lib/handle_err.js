module.exports = function(err, res, status, message) {
  console.log(err);
  res.status(status || 500).json({ msg: message || 'server error' });
};
