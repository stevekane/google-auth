var http = require('http')
  , express = require('express')
  , passport = require('passport')
  , _ = require('lodash')
  , GoogleStrategy = require('passport-google').Strategy
  , LocalStrategy= require('passport-local').Strategy
  , Database = require('./app/database').Database
  , User = require('./app/database').User
  , configureApp = require('./app/config/appconfig')
  //, configureGoogleRoutes = require('./app/routes/googleroutes')
  , configureLocalRoutes = require('./app/routes/localroutes')
  , configureApplicationRoutes = require('./app/routes/applicationroutes')
  //, configureGoogleStrategy = require('./app/strategies/googlestrategy')
  , configureLocalStrategy = require('./app/strategies/localstrategy')
  , app = express()
  , server = http.createServer(app)
  , dirname = __dirname;

var APP_CONFIG = {
  port: 3000,
  dirname: dirname,
  secret: "dat sekrit"
};

//Templates (currently static HTML)
var TEMPLATES = {
  login: dirname + "/login.html",
  app: dirname + "/app.html"
};

var models = {
  User: User
};

var tables = {
  users: []
};

var DB = new Database(models, tables);

configureApp(app, express, passport, APP_CONFIG);
configureLocalStrategy(passport, LocalStrategy, DB);
//configureGoogleStrategy(passport, GoogleStrategy, DB);
configureLocalRoutes(app, passport, TEMPLATES);
//configureGoogleRoutes(app, passport, TEMPLATES);
configureApplicationRoutes(app, passport, TEMPLATES);

server.listen(app.get('port'), function() {
  console.log("CONNECTED ON", app.get('port'))
});
