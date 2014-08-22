var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var async = require("async");

var routes = require('./routes/index');
var games = require('./routes/games');
var players = require('./routes/players');
var sessions = require('./routes/sessions');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// New Code
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('mongodb://game-tracker:3t8th52R7S*utr+mUtUc@kahana.mongohq.com:10026/game-tracker');

app.use(function(req,res,next){
    req.async = async;  
    next();
});

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;  
    next();
});


//Setting up for json
app.use(function(req,res,next){
  req.isJson = false;

  // if(req.url.substring(req.url.length-5, req.url.length) == '.json' 
  //   || req.headers.accept.indexOf('application/json') >= 0) {
  if(req.url.substring(req.url.length-5, req.url.length) == '.json') {
      req.url = req.url.replace('.json', '');
      req.isJson = true;
      res.set('Content-Type', 'application/json');
  }
  next();
});

app.use('/', routes);

app.use('/games', games);
app.use('/game/:slug', games);

app.use('/sessions', sessions);
app.use('/sessions/new/:slug', sessions);

app.use('/players', players);
app.use('/players/:username', players);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
