const Product = require('../models/product');


exports.getAddProduct = (req, res, next /*func*/) => {
    res.render('admin/add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        productsCSS: true,
        formsCSS: true,
        errorCSS: false
    });
};

exports.postAddProduct = (req, res) => {
    const title = req.body.title;
    const imageURL = req.body.imageURL;
    const price = req.body.price;
    const desc = req.body.description;

    const product = new Product(title, imageURL, desc, price);
    product.save();
    res.redirect('/');
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('admin/products', {
            prods: products, 
            pageTitle: 'Admin Products',
            path: '/admin/products'
        });
    });
};