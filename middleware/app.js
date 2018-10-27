const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const validator = require('express-validator');
const session = require('express-session')
const config = require('config');
const indexRouter = require('./routes/index');
const uploadRouter = require('./routes/upload');

let app = express();
let expressMongoDb = require('express-mongo-db');
app.use(expressMongoDb(config.mongodb_url))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(validator());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: '1c4=%vs7desjy)h49@2qh&&((*0saggy3$^wi8pf#dlv9uko9(',
    resave: true,
    saveUninitialized: true,
    name: 'dfs_app',
    cookie: { secure: true, maxAge: 1800000 }
}))
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/upload', uploadRouter);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
