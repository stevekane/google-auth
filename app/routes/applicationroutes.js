function configureRoutes (app, passport, templates, options) {
  function verifyAuth (req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login');
  }

  app.get('/', function (req, res) {
    res.redirect('/login'); 
  });

  app.get('/login', function (req, res) {
    res.sendfile(templates.login);
  });

  app.get('/app', verifyAuth, function (req, res) {
    res.sendfile(templates.app);
  });
}

module.exports = configureRoutes;
