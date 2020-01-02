const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false,
        csrfToken: req.csrfToken()
    });
};

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        isAuthenticated: false
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email: email})
        .then(user => {
            if (!user) {
                // failed to login
                return res.redirect('/login');
            }
            // check password to login
            bcrypt.compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.isLoggedIn = true;
                        req.session.user = user; // only stores data. MongoDBStore does not know about Mongoose models!
                        // This doesn't store/fetch Mongoose methods!
                        console.log(user);
                        // Sets session to mongodb, takes time. Redirect fired independently.
                        return req.session.save((err) => {
                            console.log(err);
                            res.redirect('/'); // redirect after session saved.
                        }); // ensure session created before redirect.
                        // ^^ return to prevent execution of below redirect to /login
                    }
                    res.redirect('/login');
                })
                .catch(err => {
                    console.log(err);
                    res.redirect('/login');
                })

        })
        .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    // no duplicate emails, passwords match
    User.findOne({email: email})
        .then(userDoc => {
            if (userDoc) {
                // Don't recreate.. send error message eventually.
                return res.redirect('/signup'); // should not go to next then block!!!
            }
            return bcrypt.hash(password, 12)
                .then(hashedPassword => { // embed then blocks to prevent being called by redirect above ^^
                    const user = new User({
                        email: email,
                        password: hashedPassword, // cannot store in plain text!! Using bcrypt!
                        cart: { items: [] }
                    });
                    return user.save(); // return a promise for below
                })
                .then(result => {
                    res.redirect('/login');
                }); // returns promise
        })
        // removed then blocks
        .catch(err => {
            console.log(err);
        });

    // Create a new user!
};

/*
    Post Logout clears session.
    All post request require CSRF Token in request body.
*/
exports.postLogout = (req, res, next) => {
    // method provided by package
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
};