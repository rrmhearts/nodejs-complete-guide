const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const users_list = [];
let errorHappened = false;

app.set('view engine', 'ejs');  // must match engine line, MUST MATCH EXTENSION
app.set('views', '.')

/*
Required to parse req.body
*/
app.use(bodyParser.urlencoded({extended: false})); // calls next after body parsing form.

app.use(express.static(path.join(__dirname, 'public')));

app.get('/users', (req, res, next) => {
    res.render('users', {
        users: users_list
    });
});

app.post('/add-user', (req, res) => {
    if (req.body.username.length > 0)
    {
        users_list.push({name: req.body.username});
        console.log('List: ', users_list);
        res.redirect('/users');
    } else {
        errorHappened = true;
        res.redirect('/');
    }
});

app.get('/', (req, res, next) => {
    res.render('index', {
        errorState: errorHappened
    });
    errorHappened = false;
});

app.listen(3000);