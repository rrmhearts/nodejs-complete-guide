const path = require('path');

const express = require('express');
const router = express.Router();

const rootDir = require('../util/path');
/*
    Mini-express app which can be exported.
*/

const products = [];

// /admin/add-product => GET
router.get('/add-product', (req, res, next /*func*/) => {
    res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
}); // add a new middleware function

// /admin/add-product => POST
router.post('/add-product', (req, res) => {
    products.push({title: req.body.title}); //console.log(req.body);
    res.redirect('/');
});

exports.routes = router;
exports.products = products;

//module.exports = router;