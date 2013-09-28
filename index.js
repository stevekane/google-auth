var http = require('http')
  , fs = require('fs')
  , express = require('express')
  , Handlebars = require('handlebars')
  , app = express()
  , server = http.createServer(app)
  , dirname = __dirname;

var indexTemplateString = fs.readFileSync('templates/index.handlebars').toString()
  , indexTemplate = Handlebars.compile(indexTemplateString)
  , templates = {};

templates['index'] = indexTemplate;

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

function configureRoutes (app, templates, options) {
  var index = templates['index'];

  app.get('/', function (req, res ) {
    res.send(index({intro: "This text was rendered on the server"}));
  });
  return app;
}

configureApp(app, {port: 3000, dirname: dirname, secret: "dat sekrit"});
configureRoutes(app, templates, {dirname: dirname});

server.listen(app.get('port'));
