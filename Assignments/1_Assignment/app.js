const http = require('http');

const newNames = [];

const server = http.createServer((req, res) => {

    if (req.url === '/')
    {
        res.setHeader('Content-type', 'text/html');
        res.write('<html><head><title>Welcome to my page</title></head><body>');
        res.write('<h1>Welcome to Assignment 1</h1><p>Here is my page.</p>');
        res.write('<form action="/create-user" method="POST">');
        res.write('<input type="text" name="username"><button type="submit"> \
                  POST</button></input></form>');
        res.write('</body></html>');
        return res.end();

    } else if (req.url === '/users')
    {
        res.setHeader('Content-type', 'text/html');
        res.write('<html><head><title>Welcome to my page</title></head><body>');
        res.write('<h1>Users</h1>');
        res.write('<ul><li>Ryan M</li><li>Bobby G</li>');
        res.write('<li>Alice W</li>');
        newNames.forEach((value) => {
            res.write('<li>'+value+'</li>');
        });
        res.write('</ul>');
        res.write('</body></html>');
        return res.end();

    } else if (req.url === '/create-user' && req.method === 'POST')
    {
        const body = [];

        req.on('data', (chunk) => {
            body.push(chunk);
        });
        return req.on('end', () => {
            const parsedUser = Buffer.concat(body).toString();
            console.log(parsedUser);
            newNames.push(parsedUser.split('=')[1]);
            res.statusCode = 302;
            res.setHeader('Location', '/users');
            return res.end();
        });
    } else {
        res.setHeader('Content-type', 'text/html');
        res.write('<html><head><title>Welcome to my page</title></head><body>');
        res.write('<h1>Welcome to Assignment 1</h1><p>Here is my page.</p>');
        res.write('<form action="/create-user" method="POST">');
        res.write('<input type="text" name="username"><button type="submit"> \
                  POST</button></input></form>');
        res.write('</body></html>');
        return res.end();
    }

}).listen(3000);

/*

*/