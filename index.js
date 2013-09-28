var http = require('http')
  , express = require('express')
  , app = express()
  , server = http.createServer(app)
  , dirname = __dirname;

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
    .use(express.static(options.dirname));
  return app;
}

//takes in app, templates, and options and mutates adds
//route handlers to the app object
function configureRoutes (app, templates, options) {
  app.get('/', function (req, res) {
    res.sendfile(templates.login);
  });

  //TODO: THIS SHOULD CALL OUT TO GOOGLE AND CONFIRM LOGIN
  //BEFORE SAVING A TOKEN AND SENDING THE NEW FILE DOWN 
  //TO THE CLIENT VIA A REDIRECT
  app.get('/auth/google', function (req, res) {
    res.redirect('/app');
  });

  //TODO: An Auth-protected route should go here for the actual app
  app.get('/app', function (req, res) {
    res.sendfile(templates.app);
  });
  return app;
}

configureApp(app, {port: 3000, dirname: dirname, secret: "dat sekrit"});
configureRoutes(app, templates, {dirname: dirname});

server.listen(app.get('port'));
