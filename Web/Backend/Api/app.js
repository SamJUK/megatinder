const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const profileRoutes = require('./routes/profiles');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/profiles', profileRoutes);

app.use((req, res, next) => {
   const error = new Error('404 Not Found');
   error.status = 404;
   next(error);
});

app.use((err, req, res, next) => {
   res.status(err.status || 500);
   res.json({
      error: {
          code: err.status || 500,
          message: err.message
      }
   });
});

module.exports = app;