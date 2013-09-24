minispade.register('Application.js', function() {
var alias;

alias = Ember.computed.alias;

window.Ideabox = Ember.Application.create();

Ideabox.Router.map(function() {
  this.resource("login");
  return this.resource("ideabox");
});

Ideabox.SocketRoute = Ember.Route.extend({
  actions: {
    willTransition: function(transition) {
      var socketController;
      return socketController = this.controllerFor("socket");
    }
  }
});

Ideabox.IndexRoute = Ideabox.SocketRoute.extend({
  redirect: function() {
    return this.replaceWith("login");
  }
});

Ideabox.LoginRoute = Ideabox.SocketRoute.extend();

Ideabox.IdeaboxRoute = Ideabox.SocketRoute.extend();

Ideabox.SocketController = Ember.Controller.extend({
  init: function() {
    var self, socket;
    self = this;
    socket = io.connect("localhost:3000");
    socket.on("connect", function() {
      return self.set("socket", socket);
    });
    return socket.on("disconnect", function() {
      return self.set("socket", null);
    });
  }
});

Ideabox.LoginController = Ember.Controller.extend({
  needs: ['socket'],
  socket: alias("controllers.socket.socket"),
  actions: {
    checkName: function(name) {
      var socket;
      this.transitionToRoute("ideabox");
      socket = this.get("socket");
      return socket.emit("loginVerify", name, function() {
        return console.log("login roundtripped");
      });
    }
  },
  potentialName: "",
  resetName: function() {
    return this.set("potentialName", "");
  }
});

Ideabox.IdeaboxController = Ember.Controller.extend({
  killRatings: [1, 2, 3, 4, 5],
  killValue: null,
  resetKillValue: function() {
    return this.set("killValue", null);
  }
});

});

minispade.register('Router.js', function() {


});
