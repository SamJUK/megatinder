const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongo = require('mongodb');
const monk = require('monk');
const db = monk('mongodb://127.0.0.1:27017/megatinder');

const profileRoutes = require('./routes/profiles');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(function(req, res,next) {
   req.db = db;
   next();
});

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