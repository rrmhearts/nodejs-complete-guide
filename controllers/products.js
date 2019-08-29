
// Controller logic / Model logic

const products = [];

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
    products.push({title: req.body.title});
    res.redirect('/');
};

exports.getProducts = (req, res, next) => {
    res.render('shop', {
        prods: products, 
        pageTitle: 'Shop',
        path: '/', 
        hasProducts: products.length > 0,
        productsCSS: true,
        formsCSS: false,
        errorCSS: false
    });
};