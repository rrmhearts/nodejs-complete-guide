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
// runs on every request
app.use((req, res, next /*func*/) => {
    console.log('In the middleware');
    next(); // go to next middleware 
}); // add a new middleware function

app.use((req, res, next /*func*/) => {
    console.log('In ANOTHER middleware');
    res.send('<h1>Hello from Express!</h1>')
}); // add a new middleware function

app.listen(3000); /* REPLACES
const server = http.createServer(app);
server.listen(3000); */