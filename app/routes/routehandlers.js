module.exports = function (app, options) {

  app.get('/', function ( req, res ) {
    res.sendfile(options.dirname + "/index.html");
  });

};
