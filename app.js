const path = require('path');

const express = require('express');
const app = express(); // Valid request handler.
const bodyParser = require('body-parser');

const errorController = require('./controllers/errors');

app.set('view engine', 'ejs');  // must match engine line, MUST MATCH EXTENSION
app.set('views', 'views') // /views is already default. not needed. Where to find templates!

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

/* TESTING
db.execute('SELECT * FROM products')
    .then(result => {
        console.log(result[0]);
    })
    .catch(err => {
        console.log(err);
    });
*/
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

app.use('/admin', adminRoutes);
app.use(shopRoutes);

// Catch all 404 error page.
app.use(errorController.getError404);
app.listen(3000);