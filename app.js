const path = require('path');

const express = require('express');
const app = express(); // Valid request handler.
const bodyParser = require('body-parser');

// Handlebars not "auto installed" by express
const expressHbs = require('express-handlebars');

// Set global values in app. Could be anything. 
// List of things in express api - "view engine"
app.engine('hbs', expressHbs()); // pug was built in, Handlebars is not!
app.set('view engine', 'hbs');  // must match engine line, MUST MATCH EXTENSION
app.set('views', 'views') // /views is already default. not needed. Where to find templates!
app.locals.layout = false;

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

app.use('/admin', adminData.routes);
app.use(shopRoutes);

// Catch all 404 error page.
app.use((req, res, next) => {
    //res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
    res.status(404).render('404', {pageTitle: 'Page Not Found'/*, layout: false*/}); // Passing data into templating engine DOESN't change

});
app.listen(3000);