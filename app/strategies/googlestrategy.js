//configure passport's google strat
function configureGoogleStrategy (passport, GoogleStrategy, DB) {
  var GOOGLE_CONFIG = {
    returnURL: 'http://localhost:3000/auth/google/return',
    realm: 'http://localhost:3000'
  };

  function verifyGoogleLogin (identifier, profile, done) {

    //TODO: this needs to use DB's find methods not this jank
    var user = new DB.User({
      name: profile.displayName,
      email: profile.emails[0].value,
      identifier: identifier
    });
    console.log("USER: ", user);
    DB.users.push(user);
    return done(null, user);
  };
  passport.use(new GoogleStrategy(GOOGLE_CONFIG, verifyGoogleLogin));
};

module.exports = configureGoogleStrategy;
