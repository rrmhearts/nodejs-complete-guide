const User = require('../models/user');

exports.getLogin = (req, res, next) => {
/*
Assignment 5
    Ensure on login, fetch user data, not in middleware.
    Store user in session! After login!
*/

    // Use cookie-parser
    // Sensitive data should never be stored client side!
    // Cookies can be sent to multiple pages
    
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: req.session.isLoggedIn
    });
    // Sessions are stored serverside!
};

exports.postLogin = (req, res, next) => {
    /*
    Assignment 5
       Fetch user and store user in session 
       Adjust code to use session data.
    */
    User.findById('5df9303a0bed90442e55d5cd')
    .then(user => {
        // Create model in order to use methods.
        req.session.isLoggedIn = true;
        req.session.user = user;
        console.log(req.session.user);
    })
   .catch(err => {
       req.session.user = "FAILED";
       req.session.isLoggedIn = false;
       console.log(err);
    });

    /* Express Session will set cookie to identify you to server, but encrypted. */

    // Request dies when we send response!
    res.redirect('/'); // resPONSE
};