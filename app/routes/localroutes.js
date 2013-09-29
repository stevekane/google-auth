function configureLocalRoutes (app, passport, templates, options) {
  var localRedirects = {
    successRedirect: "/app",
    failureRedirect: "/"
  };
  
  var auth = passport.authenticate('local');
  var redirect = passport.authenticate('google', localRedirects);

  app.post('/login', passport.authenticate('local', redirect));
  return app;
}

module.exports = configureLocalRoutes;
