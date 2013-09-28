var _ = require('lodash')
  , Models = require('../models.js');

function login (username, fn) {
  var newUser;

  newUser = new Models.User(username);
  fn(null, {user: newUser}); 
};

//logout event handler
function logout (username, fn) {
  fn(null, {message: "user successfully logged out"});
};

//disconnect event handler
function disconnect (user, fn) {
  console.log("disconnect attempted no implementation");
};

var socketHandlers = {
  login: login,
  logout: logout,
  disconnect: disconnect
};

function loadSocketHandlers (socketHandlers) {
  return function (socket) {
    _.each(Object.keys(socketHandlers), function (key) {
      socket.on(key, socketHandlers[key]); 
    });
  };
};

module.exports = function (io) {
  io.sockets.on('connection', loadSocketHandlers(socketHandlers));
};
