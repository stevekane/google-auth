minispade.register('Application.js', function() {
var alias, enterReconnect, handleConnection;

alias = Ember.computed.alias;

window.Ideabox = Ember.Application.create();

Ideabox.Router.map(function() {
  this.resource("reconnect");
  this.resource("login");
  return this.resource("ideabox");
});

Ideabox.ApplicationRoute = Ember.Route.extend();

Ideabox.AuthRoute = Ember.Mixin.create({
  activate: function() {
    this._super.apply(this, arguments);
    if (this.controllerFor("user").get("content") === null) {
      return this.replaceWith("login");
    }
  }
});

Ideabox.SocketRoute = Ember.Route.extend({
  actions: {
    willTransition: function(transition) {
      var socket;
      socket = this.controllerFor("socket").get('socket');
      if (socket === null) {
        if (transition) {
          transition.abort();
        }
        return context.transitionTo("reconnect");
      }
    }
  }
});

Ideabox.ReconnectRoute = Ember.Route.extend({
  activate: function() {
    var connected;
    connected = this.controllerFor("socket").get('connected');
    if (connected) {
      return this.transitionTo("login");
    }
  },
  actions: {
    willTransition: function(transition) {
      var connected;
      connected = this.controllerFor("socket").get('connected');
      if (!connected) {
        return transition.abort();
      }
    }
  }
});

Ideabox.IndexRoute = Ideabox.SocketRoute.extend({
  redirect: function() {
    return this.replaceWith("login");
  }
});

Ideabox.LoginRoute = Ideabox.SocketRoute.extend();

Ideabox.IdeaboxRoute = Ideabox.SocketRoute.extend(Ideabox.AuthRoute, {});

Ideabox.ApplicationController = Ember.Controller.extend({
  needs: ['socket', 'user'],
  socket: alias("controllers.socket.socket"),
  init: function() {
    this._super.apply(this, arguments);
    return this.get('controllers.socket');
  }
});

Ideabox.UserController = Ember.ObjectController.extend({
  actions: {
    attemptLogin: function(name, socket) {
      var self;
      self = this;
      return socket.emit("login", name, function(error, data) {
        var newUser;
        if (error) {
          alert(error);
          return resetName();
        } else {
          newUser = Ember.Object.create(data.user);
          self.set("content", newUser);
          return self.transitionToRoute("ideabox");
        }
      });
    },
    attemptLogout: function(user, socket) {
      var self;
      self = this;
      return socket.emit('logout', user.username, function(error, data) {
        if (error) {
          return alert(error);
        } else {
          self.set("content", null);
          return self.transitionToRoute("login");
        }
      });
    }
  }
});

enterReconnect = function(context) {
  return function() {
    context.set("connected", false);
    return context.transitionToRoute("reconnect");
  };
};

handleConnection = function(context) {
  return function() {
    context.set("connected", true);
    return context.transitionToRoute("login");
  };
};

Ideabox.SocketController = Ember.Controller.extend({
  socket: null,
  connected: false,
  init: function() {
    var self, socket;
    this._super.apply(this, arguments);
    self = this;
    socket = io.connect("//localhost:3000").on("connect", handleConnection(self)).on("disconnect", enterReconnect(self)).on("error", enterReconnect(self)).on("connect_failed", enterReconnect(self));
    return this.set("socket", socket);
  }
});

Ideabox.LoginController = Ember.Controller.extend({
  needs: ['user', 'socket'],
  userCon: alias("controllers.user"),
  socket: alias("controllers.socket.socket"),
  potentialName: ""
});

Ideabox.IdeaboxController = Ember.Controller.extend({
  needs: ['user', 'socket', 'login'],
  userCon: alias("controllers.user"),
  socket: alias("controllers.socket.socket"),
  killRatings: [1, 2, 3, 4, 5],
  killValue: null,
  resetKillValue: function() {
    return this.set("killValue", null);
  }
});

});

minispade.register('Router.js', function() {


});
