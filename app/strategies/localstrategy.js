//configure passport's local strat
function configureLocalStrategy (passport, LocalStrategy, DB) {
  
  function passwordMatches (candidate, password) {
    return candidate === password;
  }
  
  function verifyLocalLogin (username, password, done) {
    console.log("username:", username, "password:", password);
    DB.find('User', 'users', 'username', username, function (err, user) {
      console.log("Found User: ", user);
      if (err) { done(err); } 
      if (user) {
        if (passwordMatches(user.password, password)) {
          done(null, user); 
        } else {
          done(null, false, {message: 'wrong password'}); 
        }
      } else {
        done(null, false, {message: "no user found by that name"}); 
      }
    });
  };
  passport.use(new LocalStrategy(verifyLocalLogin));
}

module.exports = configureLocalStrategy;
