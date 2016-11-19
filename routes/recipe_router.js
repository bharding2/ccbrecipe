const Router = require('express').Router;
const bodyParser = require('body-parser').json();
const handleErr = require(__dirname + '/../lib/handle_err');

module.exports = function(connection, authenticat) {
  const Recipe = require(__dirname + '/../models/recipe')(connection);
  var recipeRouter = Router();

  recipeRouter.post('/recipes', authenticat.tokenAuth,
  bodyParser, (req, res) => {
    var newRecipe = new Recipe(req.body);
    newRecipe.creatorId = req.user._id;

    newRecipe.save((err, data) => {
      if (err) return handleErr(err, res, 401, 'error saving recipe');
      res.status(200).json(data);
    });
  });

  recipeRouter.put('/recipes/:id', authenticat.tokenAuth,
  bodyParser, (req, res) => {
    var recipeData = req.body;
    delete recipeData._id;

    if (req.user.admin) {
      return Recipe.update({ _id: req.params.id }, recipeData, (err, data) => {
        if (err) return handleErr(err, res, 401, 'error updating recipe');
        if (!data.ok) return handleErr(null, res, 401, 'error updating recipe');
        if (!data.nModified) return handleErr(null, res, 404, 'recipe not found');
        return res.status(200).json({ msg: 'recipe updated by admin' });
      });
    }

    Recipe.update({ _id: req.params.id, creatorId: req.user._id }, recipeData, (err, data) => {
      if (err) return handleErr(err, res, 401, 'error updating recipe');
      if (!data.ok) return handleErr(null, res, 401, 'error updating recipe');
      if (!data.nModified) return handleErr(null, res, 404, 'recipe not found');
      res.status(200).json({ msg: 'recipe updated by creator' });
    });
  });

  recipeRouter.delete('/recipes/:id', authenticat.tokenAuth,
  (req, res) => {
    if (req.user.admin) {
      return Recipe.findOneAndRemove({ _id: req.params.id }, (err) => {
        if (err) return handleErr(err, res, 401, 'error deleting recipe');
        return res.status(200).json({ msg: 'recipe deleted by admin' });
      });
    }

    Recipe.findOneAndRemove({ _id: req.params.id, creatorId: req.user._id }, (err) => {
      if (err) return handleErr(err, res, 401, 'error deleting recipe');
      res.status(200).json({ msg: 'recipe deleted by creator' });
    });
  });

  recipeRouter.get('/recipes/all', authenticat.tokenAuth, (req, res) => {
    Recipe.find(null, (err, data) => {
      if (err) return handleErr(err, res, 403, 'error accessing recipes');
      res.status(200).json(data);
    });
  });

  recipeRouter.get('/recipes/current', authenticat.tokenAuth, (req, res) => {
    Recipe.find({ current: true }, (err, data) => {
      if (err) return handleErr(err, res, 403, 'error accessing recipes');
      res.status(200).json(data);
    });
  });

  recipeRouter.get('/recipes/mine', authenticat.tokenAuth,
  (req, res) => {
    Recipe.find({ creatorId: req.user._id }, (err, data) => {
      if (err) return handleErr(err, res, 403, 'error accessing recipes');
      res.status(200).json(data);
    });
  });

  recipeRouter.get('/recipes/:id', authenticat.tokenAuth, (req, res) => {
    Recipe.findOne({ _id: req.params.id }, (err, data) => {
      if (err) return handleErr(err, res, 403, 'error accessing recipe');
      if (!data) return handleErr(err, res, 404, 'recipe not found');
      res.status(200).json(data);
    });
  });

  return recipeRouter;
};
