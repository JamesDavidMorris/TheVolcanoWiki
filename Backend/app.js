var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

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

// Middleware to attach db to request
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

// Serve Swagger docs at /api-docs
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// API routes with /api prefix
app.use('/api', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api', volcanoesRouter); // Note: this will add routes like /api/countries and /api/volcanoes
app.use('/api/custom', customRouter);

// Serve React frontend static files
app.use(express.static(path.join(__dirname, '../Frontend/build')));

// Catch-all route to serve React frontend (with check to avoid API route interference)
app.get('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(__dirname, '../Frontend/build', 'index.html'));
});

// Knex version endpoint
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

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler
app.use(function(err, req, res, next) {
  console.error('Error handler:', err.message, err.stack); // Log the error
  res.status(err.status || 500).json({ error: err.message });
});

module.exports = app;
