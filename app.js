const express = require('express');
const app = express(); // Valid request handler.
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
app.use('/', (req, res, next) => {
    console.log('this always runs');
    next();
});
app.use('/add-product' /*default*/, (req, res, next /*func*/) => {
    console.log('In ANOTHER middleware');
    res.send('<h1>Add product page</h1>')
}); // add a new middleware function

/* must call next to go to next middleware! 
    next() will take you to the middleware below
*/

// routes that start with / 
app.use('/' /*default*/, (req, res, next /*func*/) => {
    console.log('In ANOTHER middleware');
    res.send('<h1>Hello from Express!</h1>')
}); // add a new middleware function

app.listen(3000); /* REPLACES
const server = http.createServer(app);
server.listen(3000); */