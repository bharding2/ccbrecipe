const Router = require('express').Router;
const bodyParser = require('body-parser').json();
const handleErr = require(__dirname + '/../lib/handle_err');

module.exports = function(connection, authenticat) {
  const Recipe = require(__dirname + '/../models/recipe')(connection);
  var recipeRouter = Router();

  recipeRouter.post('/recipes', authenticat.tokenAuth, bodyParser, (req, res) => {
    var newRecipe = new Recipe(req.body);
    newRecipe.creatorId = req.user._id;

    newRecipe.save((err, data) => {
      if (err) return handleErr(err, res);
      res.status(200).json(data);
    });
  });

  recipeRouter.put('/recipes/:id', authenticat.tokenAuth, bodyParser, (req, res) => {
    var recipeData = req.body;
    delete recipeData._id;
    Recipe.update({ _id: req.params.id, creatorId: req.user._id }, recipeData, (err, data) => {
      if (!data.nModified) return res.status(500).json({ msg: 'no recipe found' });
      if (err) return handleErr(err, res);
      res.status(200).json({ msg: 'recipe updated' });
    });
  });

  recipeRouter.delete('/recipes/:id', authenticat.tokenAuth, (req, res) => {
    Recipe.findOneAndRemove({ _id: req.params.id, creatorId: req.user._id }, (err) => {
      if (err) return handleErr(err, res);
      res.status(200).json({ msg: 'recipe deleted' });
    });
  });

  return recipeRouter;
};
