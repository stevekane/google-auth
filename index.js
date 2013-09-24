var path = require('path')
  , express = require('express')
  , http = require('http')
  , fs = require('fs')
  , io = require('socket.io');
var uuid = require('node-uuid');
var app = express();

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

// app.listen(app.get('port'), function () {
  // console.log('express listening on port ' + app.get('port'));
// });

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
io = io.listen(server);
io.set('log level', 2);
function user(name){
  this.uuid = new uuid.v4();
  this.name = name;
};

function idea(content, killRating, owner, vote)
{
  this.uuid = new uuid.v4();
  this.content = content;
  this.killRating = killRating;
  this.owner = owner;
  this.vote = vote;
};


var userlist = [];
idealist = [];


io.sockets.on('connection', function (socket) {

	// when the client emits 'sendchat', this listens and executes
	socket.on('loginVerify', function (username) {
    console.log(username, " is trying to connect");
    for ( var i = 0; i <= userlist.length; i++)
      if (username === userlist[i])
        io.sockets.emit('invalidUser');
      else
        var newUser = new user(username);
        socket.uuid = newUser.uuid;
        userlist[socket.uuid] = username;
        io.sockets.emit('validUser', userlist, idealist);
        //send valid user confirmation, list of connected users, list of all ideas
	});
  
  
	// when the user disconnects.. perform this
	socket.on('disconnect', function(){
		// remove the username from global usernames list
    user = userlist[socket.uuid];
		delete userlist[socket.uuid];
		// update list of users in chat, client-side
		io.sockets.emit('updateUsers', userlist);
		// echo globally that this client has left
		socket.broadcast.emit('userDisconnet', 'SERVER', user + ' has disconnected');
	});
});
