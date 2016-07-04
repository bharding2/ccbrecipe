if (!process.env.APP_SECRET) throw new Error('you need an APP_SECRET env variable');

const express = require('express');
const Router = require('express').Router;
const bodyParser = require('body-parser').json();
const handleErr = require(__dirname + '/lib/handle_err');
const mongoose = require('mongoose');
const Authenticat = require('authenticat');

const app = express();
const PORT = process.env.PORT || 5555;

const connection = mongoose.createConnection(process.env.MONGODB_URI ||
  'mongodb://localhost/ccbrecipe_DB');
const authenticat = new Authenticat(connection);

var recipeSchema = new mongoose.Schema({
  name: String,
  creatorId: String
});

var Recipe = connection.model('Recipe', recipeSchema);
var recipeRouter = Router();

app.use('/api', authenticat.router);
app.use('/api', recipeRouter);

recipeRouter.post('/recipes', authenticat.tokenAuth, bodyParser, (req, res) => {
  var newRecipe = new Recipe(req.body);
  newRecipe.creatorId = req.user._id;

  newRecipe.save((err, data) => {
    if (err) return handleErr(err, res);
    res.status(200).json(data);
  });
});

app.use(express.static(__dirname + '/build'));

module.exports = exports = app.listen(PORT, () => console.log('server up on port: ' + PORT));
