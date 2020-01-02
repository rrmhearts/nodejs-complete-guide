const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false
  });
};

exports.getSignup = (req, res, next) => {
    res.render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      isAuthenticated: false
    });
  };

exports.postLogin = (req, res, next) => {
  User.findById('5df9303a0bed90442e55d5cd')
    .then(user => {
      req.session.isLoggedIn = true;
      req.session.user = user; // only stores data. MongoDBStore does not know about Mongoose models!
                      // This doesn't store/fetch Mongoose methods!
                      console.log(user);
      // Sets session to mongodb, takes time. Redirect fired independently.
      req.session.save((err) => {
          console.log(err);
          res.redirect('/'); // redirect after session saved.
      }); // ensure session created before redirect.
    })
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {

  };

/*
    Post Logout clears session.
*/
exports.postLogout = (req, res, next) => {
    // method provided by package
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};
