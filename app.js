require('dotenv').config()

const createError = require('http-errors');
const cors = require("cors");
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./documentation/swagger_output.json')


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/api/users');
const storesRouter = require('./routes/api/stores');
const listsRouter = require('./routes/api/lists');
const productsRouter = require('./routes/api/products');
const votesRouter = require('./routes/api/votes');
const admin = require('./firebase/admin')

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);  // defines conversion method
app.use('/users', usersRouter);
app.use('/stores', storesRouter);
app.use('/lists', listsRouter);
app.use('/products', productsRouter);
app.use('/votes', votesRouter);

// DOCS
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err.message);
  // render the error page
  res.status(err.status || 500);
  res.send('Error. Please check server logs');
});

module.exports = app;
