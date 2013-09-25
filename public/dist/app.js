minispade.register('Application.js', function() {
var alias, _establishConnection, _handleConnection;

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

Ideabox.LoginRoute = Ideabox.SocketRoute.extend({
  actions: {
    login: function(user) {
      this.controllerFor("user").set("content", user);
      return this.transitionTo("ideabox");
    }
  }
});

Ideabox.IdeaboxRoute = Ideabox.SocketRoute.extend(Ideabox.AuthRoute, {
  test: "whatever"
});

Ideabox.ApplicationController = Ember.Controller.extend({
  needs: ['socket', 'user'],
  socket: alias("controllers.socket.socket"),
  userCon: alias("controllers.user"),
  init: function() {
    this._super.apply(this, arguments);
    return this.get('controllers.socket');
  },
  actions: {
    logout: function() {
      var socket, userCon;
      userCon = this.get("userCon");
      socket = this.get("socket");
      return this.transitionTo("login");
    }
  }
});

Ideabox.UserController = Ember.ObjectController.extend();

_establishConnection = function(context) {
  return function() {
    context.set("connected", false);
    return context.transitionToRoute("reconnect");
  };
};

_handleConnection = function(context) {
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
    socket = this.get("socket");
    self = this;
    socket = io.connect("//localhost:3000").on("connect", _handleConnection(self)).on("disconnect", _establishConnection(self)).on("error", _establishConnection(self)).on("connect_failed", _establishConnection(self));
    return this.set("socket", socket);
  }
});

Ideabox.LoginController = Ember.Controller.extend({
  needs: ['socket'],
  socket: alias("controllers.socket.socket"),
  actions: {
    attemptLogin: function(name) {
      var self, socket;
      socket = this.get("socket");
      self = this;
      return socket.emit("login", name, function(error, data) {
        var newUser;
        if (error) {
          alert(error);
          resetName();
        } else {
          newUser = Ember.Object.create(data.user);
          self.send("login", newUser);
        }
        return self.resetName();
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
