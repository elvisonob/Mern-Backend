const express = require('express');
const bodyParser = require('body-parser');
const placesRoutes = require('./routes/places-route');
const usersRoutes = require('./routes/users-routes');
const mongoose = require('mongoose');
const HttpError = require('./models/http-error');
const { mongoDbKey } = require('./util/keys');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError('Could not find route', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occured!' });
});

mongoose
  .connect(mongoDbKey)
  .then(() => app.listen(5000))
  .catch((err) => console.log(err));
