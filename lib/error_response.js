const HandleErr = require('./handle_err');

module.exports = function() {
  return (req, res, next) => {
    res.sendErr = (err) => {
      if (err && HandleErr.isHandleError(err)) {
        return res.status(err.status).json({ msg: err.resMessage });
      }
      res.status(500).json({ msg: 'internal server error' });
    };
    next();
  };
};
