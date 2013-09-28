var http = require('http')
  , express = require('express')
  , app = express()
  , configureApp = require('./app/config/appconfig.js')
  , configureSockets = require('./app/config/socketconfig.js')
  , loadSocketHandlers = require('./app/routes/sockethandlers.js')
  , loadRoutes = require('./app/routes/routehandlers.js')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server)
  , dirname = __dirname;

configureApp(app, {secret: "mysecret", port: 3000, dirname: dirname});
loadRoutes(app, {dirname: dirname});
configureSockets(io);
loadSocketHandlers(io);

server.listen(app.get('port'));
