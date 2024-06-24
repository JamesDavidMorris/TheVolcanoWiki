var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

const jwt = require('jsonwebtoken');
const knexConfig = require('./knexfile');

const knex = require('knex')(knexConfig[process.env.NODE_ENV || 'development']);
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./docs/volcanoes.json');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var volcanoesRouter = require('./routes/volcanoes');
var customRouter = require('./routes/custom');

var app = express();

process.env.ACCESS_TOKEN_SECRET = 'your_jwt_secret';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use((req, res, next) => {
  req.db = knex;
  next();
});
app.use(cors());

app.use(logger('combined'));

logger.token('res', (req, res) => {
  const headers = {};
  res.getHeaderNames().map(h => headers[h] = res.getHeader(h));
  return JSON.stringify(headers);
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', swaggerUI.serve);
app.get('/', swaggerUI.setup(swaggerDocument));

app.get("/knex", function (req, res, next) {
  req.db
      .raw("SELECT VERSION()")
      .then((version) => console.log(version[0][0]))
      .then(() => res.send("Version Logged successfully"))
      .catch((err) => {
        console.log(err);
        next(createError(500));
      });
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/', volcanoesRouter);
app.use('/custom', customRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
