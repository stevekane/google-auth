minispade.register('Application.js', function() {
window.Ideabox = Ember.Application.create();
minispade.require("Router.js");

});

minispade.register('Router.js', function() {
Ideabox.Router.map(function() {
  this.resource("ideabox");
  return this.resource("graveyard");
});

});
