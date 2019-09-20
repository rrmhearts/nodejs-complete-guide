const Product = require('../models/product');
const Cart = require('../models/cart');
// Controller logic 

exports.getHomePage = (req, res, next) => {
    Product.fetchAll()
        .then(([rows, fieldData]) => {
            console.log(rows);
            // Destructured array.
            res.render('shop/index', { // maybe shop/index product-list
                prods: rows, 
                pageTitle: 'Shop',
                path: '/'
            });
        })
        .catch(err => console.log(err));

};

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
    .then(([rows, fieldData]) => {
        console.log(rows);
        // Destructured array.
        res.render('shop/product-list', {
            prods: rows, 
            pageTitle: 'All Products',
            path: '/products'
        });
    })
    .catch(err => console.log(err));
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId; // name after the colon in route
    Product.findById(prodId)
        .then(([prod, fieldData]) => {
            console.log(prod);
            // Destructured array.
            res.render('shop/product-detail', {
                product: prod[0],
                pageTitle: prod.title,
                path: '/products'
            });
        })
        .catch(err => console.log(err));
}

// For loading the cart page.. for display!
exports.getCart = (req, res, next) => {
    Cart.getCart(cart => {
        // Cart JSON of [], price.

        // THIS CAN BE IMPROVED.
        Product.fetchAll(products => {
            const cartProducts = [];
            for (let product of products) {
                // cart.products has id and qty
                const cartProduct = cart.products.find(prod => prod.id === product.id);
                if (cartProduct) {
                    // Product from product page, quantity from cart.
                    cartProducts.push({productData: product, qty: cartProduct.qty});
                }
            }
            res.render('shop/cart', {
                pageTitle: 'Your Cart',
                path: '/cart', 
                products: cartProducts,
            });
        });
    });

};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId; // from post request
    Product.findById(prodId, (product) => {
        Cart.addProduct(prodId, product.price);
    })
    res.redirect('/cart');
};

exports.postCartDeleteItem = (req, res) => {
    const prodId = req.body.productId;
    Product.findById(prodId, product => {
        Cart.deleteProduct(prodId, product.price);
        res.redirect('/cart');
    })
};

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        pageTitle: 'Your Orders',
        path: '/orders', 
    });
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout', 
    });
};