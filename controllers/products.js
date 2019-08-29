const Product = require('../models/product');
// Controller logic 

exports.getAddProduct = (req, res, next /*func*/) => {
    res.render('add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        productsCSS: true,
        formsCSS: true,
        errorCSS: false
    });
};

exports.postAddProduct = (req, res) => {
    const product = new Product(req.body.title);
    product.save();
    res.redirect('/');
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop', {
            prods: products, 
            pageTitle: 'Shop',
            path: '/', 
            hasProducts: products.length > 0,
            productsCSS: true,
            formsCSS: false,
            errorCSS: false
        });
    });
};