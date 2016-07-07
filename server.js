if (!process.env.APP_SECRET) throw new Error('you need an APP_SECRET env variable');

const express = require('express');
const mongoose = require('mongoose');
const Authenticat = require('authenticat');

const app = express();
const PORT = process.env.PORT || 5555;

const connection = mongoose.createConnection(process.env.MONGODB_URI ||
  'mongodb://localhost/ccbrecipe_DB');
const authenticat = new Authenticat(connection);

const recipeRouter = require(__dirname + '/routes/recipe_router')(connection, authenticat);

app.use('/api', authenticat.router);
app.use('/api', recipeRouter);

app.use(express.static(__dirname + '/build'));

module.exports = exports = app.listen(PORT, () => console.log('server up on port: ' + PORT));
