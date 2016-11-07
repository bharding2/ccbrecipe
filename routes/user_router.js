const Router = require('express').Router;
const bodyParser = require('body-parser').json();
const handleErr = require(__dirname + '/../lib/handle_err');

module.exports = function(connection, authenticat) {
  const User = require(__dirname + '/../models/user')(connection);
  var userRouter = Router();

  userRouter.get('/profile', authenticat.tokenAuth, (req, res) => {
    res.status(200).json({ username: req.user.username });
  });

  userRouter.put('/users/:id', authenticat.tokenAuth, bodyParser, (req, res) => {
    var userData = req.body;
    delete userData._id;

    if (req.user.admin || req.user._id.toString() === req.params.id) {
      return User.update({ _id: req.params.id }, userData, (err, data) => {
        if (!data.nModified) return handleErr(null, res, 403, 'no user found');
        if (err) return handleErr(err, res, 401, 'error updating user');
        return res.status(200).json({ msg: 'user updated' });
      });
    }

    return handleErr(null, res, 401, 'unauthorized user update');
  });

  userRouter.delete('/users/:id', authenticat.tokenAuth, (req, res) => {
    if (req.user.admin) {
      return User.findOneAndRemove({ _id: req.params.id }, (err) => {
        if (err) return handleErr(err, res, 401, 'error deleting user');
        return res.status(200).json({ msg: 'user deleted by admin' });
      });
    }

    return handleErr(null, res, 401, 'unauthorized user update');
  });

  return userRouter;
};
