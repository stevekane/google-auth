var http = require('http')
  , express = require('express')
  , uuid = require('node-uuid')
  , passport = require('passport')
  , _ = require('lodash')
  , app = express()
  , server = http.createServer(app)
  , dirname = __dirname
  , GoogleStrategy = require('passport-google').Strategy;  

var passportStrategies = {
  GoogleStrategy: GoogleStrategy
};

var APP_CONFIG = {
  port: 3000,
  dirname: dirname,
  secret: "dat sekrit"
};

//Very basic User Model
function User (hash) {
  _.extend(this, hash);
  this.uuid = uuid.v4();
  return this;
};

//Templates (currently static HTML)
var templates = {
  login: dirname + "/login.html",
  app: dirname + "/app.html"
};

//configures app object
function configureApp (app, express, options) {
  app.set('port', process.env.PORT || options.port)
    .use(express.favicon())
    .use(express.logger('dev'))
    .use(express.cookieParser())
    .use(express.bodyParser())
    .use(express.methodOverride())
    .use(express.session({secret: options.secret}))
    .use(express.static(options.dirname))
    .use(passport.initialize())
    .use(passport.session());
  return app;
}

//configure passport.  Requires User constructor and app object
function configurePassport (passport, User, strategies) {
  var GoogleStrategy = strategies.GoogleStrategy; 
  var GOOGLE_CONFIG = {
    returnURL: 'http://localhost:3000/auth/google/return',
    realm: 'http://localhost:3000'
  };

  //This strat is not quite right yet I think, since it makes a new user everytime
  //"works" for initial authorization, but not for protecting other endpoints like /app                                    
  function verifyGoogleLogin (identifier, profile, done) {
    var user = new User({
      name: profile.displayName,
      email: profile.emails[0].value,
      identifier: identifier
    });
    console.log("USER: ", user);
    return done(null, user);
  };

  passport.use(new GoogleStrategy(GOOGLE_CONFIG, verifyGoogleLogin));

  //Test serialize / deserialize, TODO: write these for real                                    
  passport.serializeUser(function(user, done) {
    //serialize by user id
    done(null, user)
  });
                    
  passport.deserializeUser(function (id, done) {
    var user = {
      id: id, 
      email:'test',
      password:'pass'
    };
    done(null, user);
  })                  

};

//takes in app, templates, and options and mutates adds
//route handlers to the app object
function configureRoutes (app, templates, options) {
  var passport = app.get('passport');
  
  app.get('/', function (req, res) {
    res.sendfile(templates.login);
  });

  //should work with passport.authenticate('google') once the GoogleStrategy is written correctly
  app.get('/app', function (req, res) {
    res.sendfile(templates.app);
  });

  //Hit this page to start the Google Auth process  
  app.get('/auth/google', passport.authenticate('google'));

  /*
  Google will redirect the user to this URL after authentication.  Finish
  the process by verifying the assertion.  If valid, the user will be
  logged in.  Otherwise, authentication has failed.
  */
  app.get('/auth/google/return', passport.authenticate('google', {
    successRedirect: '/app',
    failureRedirect: '/login' 
  }));
}

//we attach passport instance to app object as it is "globalish"
app.set('passport', passport);
configurePassport(passport, User, passportStrategies);
configureApp(app, express, APP_CONFIG);
configureRoutes(app, templates);

server.listen(app.get('port'), function() {
  console.log("CONNECTED ON", app.get('port'))
});
