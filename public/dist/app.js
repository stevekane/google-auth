minispade.register('Application.js', function() {
var alias, checkForSocket;

alias = Ember.computed.alias;

window.Ideabox = Ember.Application.create();

Ideabox.Router.map(function() {
  this.resource("reconnect");
  this.resource("login");
  return this.resource("ideabox");
});

checkForSocket = function(context, transition) {
  var sockCon, socket;
  sockCon = context.controllerFor("socket");
  socket = sockCon.get("socket");
  if (socket === null) {
    if (transition) {
      transition.abort();
    }
    return context.transitionTo("reconnect");
  }
};

Ideabox.SocketRoute = Ember.Route.extend({
  activate: function() {
    return checkForSocket(this);
  },
  actions: {
    willTransition: function(transition) {
      return checkForSocket(this, transition);
    }
  }
});

Ideabox.ReconnectRoute = Ember.Route.extend();

Ideabox.IndexRoute = Ideabox.SocketRoute.extend({
  redirect: function() {
    return this.replaceWith("login");
  }
});

Ideabox.LoginRoute = Ideabox.SocketRoute.extend();

Ideabox.IdeaboxRoute = Ideabox.SocketRoute.extend();

Ideabox.UserController = Ember.ObjectController.extend({
  redirectOnUserChange: (function() {
    var target, user;
    user = this.get("content");
    target = user ? "ideabox" : "login";
    return this.transitionToRoute(target);
  }).observes('content')
});

Ideabox.SocketController = Ember.Controller.extend({
  socket: null,
  establishConnection: (function() {
    var self, socket;
    socket = this.get("socket");
    self = this;
    if (socket !== null) {
      return;
    }
    return socket = io.connect("//localhost:3000").on("connect", function() {
      self.transitionToRoute("login");
      return self.set("socket", socket);
    }).on("disconnect", function() {
      self.transitionToRoute("reconnect");
      return self.set("socket", null);
    }).on("error", function() {
      self.transitionToRoute("reconnect");
      return self.set("socket", null);
    }).on("connect_failed", function() {
      self.transitionToRoute("reconnect");
      return self.set("socket", null);
    });
  }).observes('socket').on('init')
});

Ideabox.LoginController = Ember.Controller.extend({
  needs: ['socket', 'user'],
  socket: alias("controllers.socket.socket"),
  user: alias("controllers.user"),
  actions: {
    checkName: function(name) {
      var socket, user;
      user = this.get("user");
      socket = this.get("socket");
      socket.emit("loginVerify", name, function() {
        return console.log("login roundtripped");
      });
      socket.on("validUser", function(data) {
        console.log(data);
        return user.set("content", Ember.Object.create(data.user));
      });
      return socket.on("invalidUser", function() {
        return user.set("content", null);
      });
    }
  },
  potentialName: "",
  resetName: function() {
    return this.set("potentialName", "");
  }
});

Ideabox.IdeaboxController = Ember.Controller.extend({
  needs: ['user'],
  user: alias("controllers.user"),
  killRatings: [1, 2, 3, 4, 5],
  killValue: null,
  resetKillValue: function() {
    return this.set("killValue", null);
  }
});

});

minispade.register('Router.js', function() {


});
