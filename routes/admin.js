const path = require('path');

const express = require('express');
const router = express.Router();

const rootDir = require('../util/path');
/*
    Mini-express app which can be exported.
*/

// /admin/add-product => GET
router.get('/add-product', (req, res, next /*func*/) => {
    res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
}); // add a new middleware function

// /admin/add-product => POST
router.post('/add-product', (req, res) => {
    console.log(req.body);
    res.redirect('/');
});

module.exports = router;