const path = require('path');

const express = require('express');
const app = express(); // Valid request handler.
const bodyParser = require('body-parser');

// Set global values in app. Could be anything. 
// List of things in express api - "view engine"
app.set('view engine', 'pug');
app.set('views', 'views') // /views is already default. not needed. Where to find templates!

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');
/*
 **** How To Express ****
    Request
    --->
    Middleware 1
    --->
    Middleware 2
    --->
    Response
*/
app.use(bodyParser.urlencoded({extended: false})); // calls next after body parsing form.
app.use(express.static(path.join(__dirname, 'public')));

/*** Moved resource to public
app.use('/resources/404.png', (req, res, next) => {
    //res.status(404).sendFile(path.join(__dirname, 'views', 'images', '404.png'));
    res.status(404).sendFile(path.join(__dirname, 'views', 'images', '404.png'));
});
*/
app.use('/admin', adminData.routes);
app.use(shopRoutes);

// Catch all 404 error page.
app.use((req, res, next) => {
    //res.status(404).sendFile(path.join(__dirname, 'views', 'images', '404.png'));
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});
app.listen(3000);