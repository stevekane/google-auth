//configures app object
function configureApp (app, express, passport, options) {
  app.set('port', process.env.PORT || options.port)
    .set('passport', passport)
    .use(express.favicon())
    .use(express.logger('dev'))
    .use(express.cookieParser())
    .use(express.bodyParser())
    .use(express.methodOverride())
    .use(express.session({secret: options.secret}))
    .use(express.static(options.dirname))
    .use(passport.initialize())
    .use(passport.session());
  return app;
}

module.exports = configureApp;
