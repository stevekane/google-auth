function configureRoutes (app, passport, templates, options) {
  var routeRedirects = {
    failureRedirect: '/login'
  };
  //var localAuth = passport.authenticate('local');
  var localAuth = passport.authenticate('local', routeRedirects);
  
  app.get('/', function (req, res) {
    res.redirect('/login'); 
  });

  app.get('/login', function (req, res) {
    res.sendfile(templates.login);
  });

  app.get('/app', localAuth, function (req, res) {
    console.log("App Route hit");
    res.sendfile(templates.app);
  });
}

module.exports = configureRoutes;
