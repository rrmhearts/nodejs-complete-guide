const express = require('express');
const app = express();


app.use('/users', (req, res, next) => {
    console.log('hello from users');
    res.send('<h1>Users Page</h1>');
});

// must be second
app.use('/', (req, res, next) => {
    console.log('hello from root');
    res.send('<h1>Root Website</h1>');
});

app.listen(3000);