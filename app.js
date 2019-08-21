const express = require('express');
const app = express(); // Valid request handler.
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/admin');
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

app.use(adminRoutes);
app.use(shopRoutes);

app.listen(3000);