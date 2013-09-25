var path = require('path')
  , http = require('http')
  , fs = require('fs')
  , express = require('express')
  , _ = require('lodash')
  , uuid = require('node-uuid')
  , app = express()
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

io.set('log level', 2);

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.session({
  secret: 'YOUR SECRET',
}));

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function ( req, res ) {
  res.sendfile(__dirname + "/index.html");
});

function User (name) {
  this.uuid = uuid.v4();
  this.name = name;
};

function Idea (content, killRating, owner, vote) {
  this.uuid = uuid.v4();
  this.content = content;
  this.killRating = killRating;
  this.owner = owner;
  this.vote = vote;
};

var userlist = [];
var idealist = [];

//login event handler
function login (username, fn) {
  var newUser;

  //check if this username is available
  if (_.contains(userlist, username)) {
    fn("username already taken", null);
  } else {
    newUser = new User(username);
    userlist.push(newUser)
    fn(null, {user: newUser}); 
  }
}

//logout event handler
function logout (username, fn) {
  //mutate the userlist to remove this username
  _.remove(userlist, username);
  fn(null, {message: "user successfully logged out"});
}

//disconnect event handler
function disconnect (user, fn) {
  console.log("disconnect attempted no implementation");
}

/*
pairs of event names and the handlers (these are like endpoints)
By naming convention, please name the handler exactly the same
as the event name.  this will make it easier to grow 
*/
var socketHandlers = [
  {eventName: "login", handler: login},
  {eventName: "disconnect", handler: disconnect}
];

//load the event handlers 
function loadSocketHandlers (socket) {
  _.each(socketHandlers, function (handler) {
    socket.on(handler.eventName, handler.handler);
  });
}

//When a connection is established, load all the socket handlers
io.sockets.on('connection', loadSocketHandlers)

//start the server
server.listen(app.get('port'), function () {
  console.log('server on', app.get('port'));
});
