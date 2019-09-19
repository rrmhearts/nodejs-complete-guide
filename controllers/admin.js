const Product = require('../models/product');


exports.getAddProduct = (req, res, next /*func*/) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
};

exports.postAddProduct = (req, res) => {
    const title = req.body.title;
    const imageURL = req.body.imageURL;
    const price = req.body.price;
    const desc = req.body.description;

    const product = new Product(null, title, imageURL, desc, price); // no id
    product.save();
    res.redirect('/');
};

exports.getEditProduct = (req, res, next /*func*/) => {
    // Check for query parameters.
    const editMode = req.query.edit; // key, holds value true.
    if (!editMode) {
        return res.redirect('/');
    }

    const prodId = req.params.productId; // from url
    Product.findById(prodId, product => {
        if (!product) {
            // Should show an error.
            console.log('Error: ', product, ' ', prodId);
            return res.redirect('/');
        }
        res.render('admin/edit-product', {
            /* these fields are passed to the view */
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: editMode,
            product: product
        });
    });

};

exports.postEditProduct = (req, res) => {
    // Updated values from edit-product.ejs
    const prodId = req.body.productId; // from edit-product.ejs
    const title = req.body.title;
    const imageURL = req.body.imageURL;
    const price = req.body.price;
    const desc = req.body.description;
    console.log(prodId, title, imageURL, desc, price);
    const product = new Product(prodId, title, imageURL, desc, price);
    product.save();
    res.redirect('/admin/products');

};

exports.postDeleteProduct = (req, res) => {
    const prodId = req.body.productId; // from edit-product.ejs
    Product.delete(prodId);
    res.redirect('/admin/products');
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