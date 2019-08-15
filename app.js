//const fs = require('fs');
const http = require('http');

// runs for every incoming request
function rqListener(req, res) {

}

//http.createServer(rqListener);

const server = http.createServer((req, res) => {
    // execute things for incoming requests

    const url = req.url;

    // if root path
    if (url === '/') {
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
        res.write('<head><title>Enter Message</title></head>');
        
        // Giving "input" a NAME, causes message to be sent to server with form POST.
        res.write('<body><form action="/message" method="POST"> \
                        <input type="text" name="message"><button type="submit">Send</button></input> \
                    </form></body>');
        res.write('</html>');
        return res.end(); // return from anonymous function. Cannot continue this function.
    }
    // this runs on /message because not in IF.
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>First page</title></head>');
    res.write('<body><h1>Hello from Server!</h1></body>');
    res.write('</html>');
    res.end();

});

server.listen(3000);