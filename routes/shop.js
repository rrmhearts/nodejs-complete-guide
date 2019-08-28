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
        hasProducts: products.length > 0,
        activeShop: true,
        activeAddProduct: false,
        productsCSS: true,
        formsCSS: false,
        errorCSS: false
    }); // Handlebars made default templating engine
    //res.sendFile(path.join(rootDir, 'views', 'shop.html')); // sending html
});

module.exports = router;