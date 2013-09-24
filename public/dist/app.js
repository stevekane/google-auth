minispade.register('Application.js', function() {
window.Ideabox = Ember.Application.create();

Ideabox.Router.map(function() {
  this.resource("login");
  return this.resource("ideabox");
});

Ideabox.SocketController = Ember.Controller.extend({
  init: function() {
    var self, socket;
    self = this;
    socket = io.connect("localhost:3000");
    console.log("yay");
    socket.on("connect", function() {
      return self.set("socket", socket);
    });
    return socket.on("disconnect", function() {
      return self.set("socket", null);
    });
  }
});

Ideabox.IndexRoute = Ember.Route.extend({
  redirect: function() {
    return this.replaceWith("login");
  }
});

Ideabox.LoginRoute = Ember.Route.extend({
  activate: function() {
    return console.log("you are in the login route");
  }
});

Ideabox.IdeaboxRoute = Ember.Route.extend();

Ideabox.LoginController = Ember.Controller.extend({
  needs: ['socket'],
  socket: Ember.alias("controllers.socket.socket"),
  actions: {
    checkName: function(name) {
      var socket;
      socket = this.get("socket");
      return socket.emit("login", {
        name: name
      }, function() {
        return console.log("login roundtripped");
      });
    }
  },
  potentialName: "",
  resetName: function() {
    return this.set("potentialName", "");
  }
});

});

minispade.register('Router.js', function() {


});
