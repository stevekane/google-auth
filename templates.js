var glob = ('undefined' === typeof window) ? global : window,

Handlebars = glob.Handlebars || require('handlebars');

this["Templates"] = this["Templates"] || {};

this["Templates"]["templates/index.handlebars"] = function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<!DOCTYPE html>\n<html>\n<head>\n  <link rel=\"stylesheet\" href=\"public/vendor/bootstrap.css\" >\n  <link rel=\"stylesheet\" href=\"public/dist/appsass.css\" >\n</head>\n<body>\n  <h1>";
  if (stack1 = helpers.intro) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.intro; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</h1>\n\n  <script src=\"http://localhost:35729/livereload.js?snipver=1\"></script>\n  <script src=\"public/vendor/jquery/jquery.min.js\"></script>\n  <script src=\"public/vendor/handlebars/handlebars.runtime.js\"></script>\n  <script src=\"public/vendor/ember/ember.js\"></script>\n\n  <script src=\"public/dist/app.js\"></script>\n  <script src=\"public/dist/apptemplates.js\"></script>\n\n</body>\n</html>\n";
  return buffer;
  };

if (typeof exports === 'object' && exports) {module.exports = this["Templates"];}