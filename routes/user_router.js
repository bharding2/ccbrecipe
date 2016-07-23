const Router = require('express').Router;

module.exports = function(connection, authenticat) {
  var userRouter = Router();

  userRouter.get('/profile', authenticat.tokenAuth, (req, res) => {
    res.status(200).json({ username: req.user.username });
  });

  return userRouter;
};
