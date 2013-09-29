var http = require('http')
  , express = require('express')
  , app = express()
  , uuid = require('node-uuid')
  , server = http.createServer(app)
  , dirname = __dirname;

var passport = require('passport')
  , GoogleStrategy = require('passport-google').Strategy;  
  

var templates = {
  login: dirname + "/login.html",
  app: dirname + "/app.html"
};

//takes in the app object and options and configures the
//app object
function configureApp (app, options) {
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

configureApp(app, {port: 3000, dirname: dirname, secret: "dat sekrit"});
configureRoutes(app, templates, {dirname: dirname});

function User () {
  this.uuid = uuid.v4();
};

//takes in app, templates, and options and mutates adds
//route handlers to the app object
function configureRoutes (app, templates, options) {
  app.get('/', function (req, res) {
    res.sendfile(templates.login);
  });
}

//Hit this page to start the Google Auth process  
app.get('/auth/google', passport.authenticate('google'));

// // Google will redirect the user to this URL after authentication.  Finish
// // the process by verifying the assertion.  If valid, the user will be
// // logged in.  Otherwise, authentication has failed.
app.get('/auth/google/return', 
  passport.authenticate('google', { successRedirect: '/app',
                                    failureRedirect: '/login' }));

//Test serialize / deserialize, TODO: write these for real                                    
passport.serializeUser(function(user, done) {
    //serialize by user id
    done(null, user)
});
                  
passport.deserializeUser(function(id, done) {
    var user = {id: id, email:'test', password:'pass'};
    done(null, user);
})                  


//This strat is not quite right yet I think, since it makes a new user everytime
// "works" for initial authorization, but not for protecting other endpoints like /app                                    
passport.use(new GoogleStrategy({
    returnURL: 'http://localhost:3000/auth/google/return',
    realm: 'http://localhost:3000'
  },
  function(identifier, profile, done) {
    
    user = new User();
    user.name = profile.displayName
    user.email = profile.emails[0].value 
    user.identifier = identifier;
    
    console.log("USER: ", user);
    return done(null,user);
    
  }
));


//should work with passport.authenticate('google') once the GoogleStrategy is written correctly
 app.get('/app', function (req, res) {
    res.sendfile(templates.app);
  });


server.listen(app.get('port'), function(){console.log("CONNECTED ON", app.get('port'))});