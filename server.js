if (!process.env.APP_SECRET) throw new Error('you need an APP_SECRET env variable');

const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5555;

// const authRouter = require(__dirname + '/routes/auth_router');
// const recipeRouter = require(__dirname + '/routes/recipe_router');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/ccbrecipe_DB');

// app.use('/api', authRouter);
// app.use('/api', recipeRouter);

app.use(express.static(__dirname + '/build'));

module.exports = exports = app.listen(PORT, () => console.log('server up on port: ' + PORT));
