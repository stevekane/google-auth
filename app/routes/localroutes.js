function configureLocalRoutes (app, passport, templates, options) {
  var localRedirects = {
    successRedirect: "/app",
    failureRedirect: "/"
  };
  
  var redirect = passport.authenticate('local', localRedirects);

  app.post('/login', redirect);
  return app;
}

module.exports = configureLocalRoutes;
