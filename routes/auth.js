const express = require('express');
const { check, body } = require('express-validator');
const router = express.Router();

const authController = require('../controllers/auth');
const User = require('../models/user');

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

router.get('/signup', authController.getSignup);
router.post('/signup',
    [
        check('email').isEmail()
            .withMessage('Please enter a valid email.')
            /* You can write your own validators */
            .custom((value) => {
                //if (value === 'test@test.com')
                //    throw new Error('This email address is forbidden.');
                //return true; // for success

                /*
                    custom returns true or a promise. Returns a rejection, stores message as an error.
                    YYY Below replaces ^^^, Promise.reject... replaces throw new Error...
                */
                return User.findOne({email: value})
                .then(userDoc => {
                    if (userDoc) {
                        return Promise.reject('E-mail exists already, please pick a different one.');
                    }
                });
            }),
        // check password in BODY of request, not headers.
        body('password',
             'Please enter a password with only numbers and text, at least 5 characters') // default withMessage
            .isLength({min: 5})
            .isAlphanumeric(),
        body('confirmPassword').custom((value, { req } ) => {
            if (value !== req.body.password) { 
                throw new Error('Passwords have to match!');
            }
            return true; // first password checked for length
            
        })
    ],
    authController.postSignup);
router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);

// Has to be named :token because controller/auth.js looks for req.params.token
router.get('/reset/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);

module.exports = router;