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
idealist = [];

io.sockets.on('connection', function (socket) {

  console.log("connection attempted");
	// when the client emits 'sendchat', this listens and executes
	socket.on('login', function (username, fn) {
    var newUser;

    //check if this username is available
    if (_.contains(userlist, username)) {
      fn("username already taken", null);
    } else {
      newUser = new User(username);
      userlist.push(newUser)
      fn(null, {user: newUser}); 
    }
  });

	// when the user disconnects.. perform this
	socket.on('disconnect', function(){
		// remove the username from global usernames list
    user = userlist[socket.uuid];
		delete userlist[socket.uuid];
		// update list of users in chat, client-side
		io.sockets.emit('updateUsers', userlist);
		// echo globally that this client has left
		socket.broadcast.emit('userDisconnect', 'SERVER', user + ' has disconnected');
	});
});

//start the server
server.listen(app.get('port'), function () {
  console.log('server on', app.get('port'));
});
