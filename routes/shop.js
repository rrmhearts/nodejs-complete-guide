const path = require('path');

const express = require('express');
const router = express.Router();

const rootDir = require('../util/path');
const adminData = require('./admin');

// routes that start with / on GET requests.
router.get('/', (req, res, next) => {
    const products = adminData.products;
    res.render('shop', {
        prods: products, 
        pageTitle: 'Shop',
        path: '/', 
        hasProducts: products.length > 0,
        productsCSS: true,
        formsCSS: false,
        errorCSS: false
    }); // EJS made default templating engine
});

module.exports = router;