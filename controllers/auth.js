require('dotenv').config();

const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
// nodemailer-sendgrid-transport has 3 vulnerabilities!

const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator');

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
            const errors = validationResult(req); // errors from express-validator

            if (!errors.isEmpty())
            {
                req.flash('error', errors.array()[0].msg);
                return res.redirect('/login');
            }
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
    //const confirmPassword = req.body.confirmPassword; checked in validator in routes
    const errors = validationResult(req); // errors from express-validator

    if (!errors.isEmpty()) {
        console.log(errors.array())
        return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            errorMessage: errors.array()[0].msg // information is removed from session!
        });
    }

    if (!email || !password) {
        req.flash('error', 'Email and Password are required.');
        return res.redirect('/signup'); // should not go to next then block!!!
    }
    /* 
        Find email message now done in routes/auth.js. User does not exist because checking for existence
         in routes/auth.js
    */
    bcrypt.hash(password, 12)
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

exports.getReset = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0 ) {
        message = message[0];
    } else {
        message = null
    }

    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset Password',
        errorMessage: message // information is removed from session!
    });
}

exports.postReset = (req, res, next) => {
    // Create random token to verify in email.
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        // exists  from form
        User.findOne({email: req.body.email})
            .then(user => {
                if (!user) {
                    req.flash('error', 'No account with that email found.');
                    return res.redirect('/reset');
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 360000;
                return user.save();
            })
            .then(result => {
                // Send token based link in email!
                res.redirect('/');
                transporter.sendMail({
                    to: req.body.email,
                    from: 'shop@node-complete.com',
                    subject: 'Password reset',
                    html: `
                        <p>You requested a password reset</p>
                        <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password</p>
                        `
                })
            })
            .catch(err => {
                console.log(err);
            });

    });
};

 exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
        .then(user => {
            if(!user) {
                return res.redirect('/login');
            }
            let message = req.flash('error');
            if (message.length > 0 ) {
                message = message[0];
            } else {
                message = null
            }
        
            res.render('auth/new-password', {
                path: '/new-password',
                pageTitle: 'New Password',
                errorMessage: message, // information is removed from session!
                userId: user._id.toString(),
                passwordToken: token
            });
        })
        .catch(err => {
            console.log(err);
        });
 };

 exports.postNewPassword = (req, res, next) => {
     const newPassword = req.body.password;
     const userId = req.body.userId;
     const passwordToken = req.body.passwordToken;

     let resetUser;

     User.findOne({
         resetToken: passwordToken,
         resetTokenExpiration: {$gt: Date.now()},
         _id: userId
        })
        .then(user => {
            resetUser = user;
            return bcrypt.hash(newPassword, 12);
        })
        .then(hashedPassword => {
            resetUser.password = hashedPassword;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpiration = undefined;
            return resetUser.save();
        })
        .then(result => {
            res.redirect('/login');
        })
        .catch(err => {
            console.log(err);
        })

 }