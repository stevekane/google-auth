minispade.register('Application.js', function() {
var alias;

alias = Ember.computed.alias;

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
  actions: function() {
    return {
      willTransition: function(transition) {
        return console.log("you are transitionining");
      }
    };
  }
});

Ideabox.IdeaboxRoute = Ember.Route.extend();

Ideabox.LoginController = Ember.Controller.extend({
  needs: ['socket'],
  socket: alias("controllers.socket.socket"),
  actions: {
    checkName: function(name) {
      return this.transitionToRoute("ideabox");
    }
  },
  potentialName: "",
  resetName: function() {
    return this.set("potentialName", "");
  }
});

Ideabox.IdeaboxController = Ember.Controller.extend({
  killRatings: [1, 2, 3, 4, 5],
  killValue: null
});

});

minispade.register('Router.js', function() {


});
