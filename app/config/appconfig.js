var express = require('express');

module.exports = function (app, options) {
  // all environments
  app.set('port', process.env.PORT || options.port)
    .use(express.favicon())
    .use(express.logger('dev'))
    .use(express.cookieParser())
    .use(express.bodyParser())
    .use(express.methodOverride())
    .use(express.session({secret: options.secret}))
    .use(express.static(options.dirname));

  // development only
  if ('development' === app.get('env')) {
    app.use(express.errorHandler());
  }

  console.log(options.dirname);

  return app;
}
