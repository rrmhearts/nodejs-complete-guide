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
    res.render('add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        productsCSS: true,
        formsCSS: true,
        errorCSS: false
    });
}); // add a new middleware function

// /admin/add-product => POST
router.post('/add-product', (req, res) => {
    products.push({title: req.body.title});
    res.redirect('/');
});

exports.routes = router;
exports.products = products;

//module.exports = router;