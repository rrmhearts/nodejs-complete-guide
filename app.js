const express = require('express');
const app = express(); // Valid request handler.
const bodyParser = require('body-parser');
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

app.use('/add-product', (req, res, next /*func*/) => {
    res.send('<form action="/product" method="POST"><input type="text" name="title"> \
        <button type="submit>Add Product</button></input></form>');
}); // add a new middleware function

app.post('/product', (req, res) => {
    console.log(req.body);
    res.redirect('/');
});

/* must call next to go to next middleware! 
    next() will take you to the middleware below
*/

// routes that start with / 
app.use('/' /*default*/, (req, res, next /*func*/) => {
    res.send('<h1>Hello from Express!</h1>')
}); // add a new middleware function

app.listen(3000); /* REPLACES
const server = http.createServer(app);
server.listen(3000); */