function configureGoogleRoutes (app, passport, templates, options) {
  var googleRedirects = {
    successRedirect: '/app',
    failureRedirect: '/login' 
  };
  
  var auth = passport.authenticate('google')
  var redirect = passport.authenticate('google', googleRedirects);

  app.get('/auth/google', auth);
  app.get('/auth/google/return', redirect);
  return app;
}

module.exports = configureGoogleRoutes;
