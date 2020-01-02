require('dotenv').config();

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
// nodemailer-sendgrid-transport has 3 vulnerabilities!

const User = require('../models/user');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: process.env.EMAIL_API,
    }
})/*config returned*/);

exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0 ) {
        message = message[0];
    } else {
        message = null
    }
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: message, // information is removed from session!
        successMessage: req.flash('success')[0] // defined as either undefined (false) or string (true)
    });
};

exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0 ) {
        message = message[0];
    } else {
        message = null
    }
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: message // information is removed from session!
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email: email})
        .then(user => {
            if (!user) {
                // failed to login, add error message to session for 1 request, then disappear.
                req.flash('error', 'Invalid email or password.');
                return res.redirect('/login');
                // How do we pass data into a view by a redirect?? (use a session w/ connect-flash)
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
                    req.session.isLoggedIn = false;
                    req.flash('error', 'Invalid email or password.');
                    res.redirect('/login');
                })
                .catch(err => {
                    req.flash('error', 'Login issue.');
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

    if (!email || !password) {
        req.flash('error', 'Email and Password are required.');
        return res.redirect('/signup'); // should not go to next then block!!!
    }
    // no duplicate emails, passwords match
    User.findOne({email: email})
        .then(userDoc => {
            if (userDoc) {
                // Don't recreate.. send error message eventually.
                req.flash('error', 'User already exists.');
                return res.redirect('/signup'); // should not go to next then block!!!
            }
            return bcrypt.hash(password, 12)
                .then(hashedPassword => { // embed then blocks to prevent being called by redirect above ^^
                    // Create a new user!
                    const user = new User({
                        email: email,
                        password: hashedPassword, // cannot store in plain text!! Using bcrypt!
                        cart: { items: [] }
                    });
                    return user.save(); // return a promise for below
                })
                .then(result => {
                    req.flash('success', 'Signup Success.');
                    res.redirect('/login');
                    return transporter.sendMail({
                        to: email,
                        from: 'shop@node-complete.com',
                        subject: 'Signup Succeeded',
                        html: '<h1>You successfully signed up!'
                    });
                })
                .catch(emailErr => {
                    console.log(emailErr);
                }); // returns promise
        })
        // removed then blocks
        .catch(err => {
            req.flash('error', 'Signup error.');
            console.log(err);
        });

};

/*
    Post Logout clears session.
    All post request require CSRF Token in request body.
*/
exports.postLogout = (req, res, next) => {
    // method provided by package
    req.session.destroy(err => {
        /* will remove session.isLoggedIn */
        console.log(err);
        res.redirect('/');
    });
};