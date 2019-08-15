//const fs = require('fs');
const http = require('http');

// runs for every incoming request
function rqListener(req, res) {

}

//http.createServer(rqListener);

const server = http.createServer((req, res) => {
    // execute things for incoming requests
    console.log('**** ', req.url, req.method, req.headers);
    // process.exit(); // kills server
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>First page</title></head>');
    res.write('<body><h1>Hello from Server!</h1></body>');
    res.write('</html>');
    res.end();

});

server.listen(3000);