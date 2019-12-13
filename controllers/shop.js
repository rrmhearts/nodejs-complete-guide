const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  // Product.fetchAll({ where: { id: prodId } })
  //   .then(products => {
  //     res.render('shop/product-detail', {
  //       product: products[0],
  //       pageTitle: products[0].title,
  //       path: '/products'
  //     });
  //   })
  //   .catch(err => console.log(err));

  /*
    Changed to findById because we switched dbs.
  */
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart() // magic method sequelize
    .then(cart => {
      return cart
        .getProducts() // magic method sequelize
        .then(products => {
          res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            products: products
          });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart() // magic method sequelize
    .then(cart => {
      fetchedCart = cart;
      // This must be using "cart item to connect prodId with cart."
      return cart.getProducts({ where: { id: prodId } }); // magic method sequelize
    })
    .then(products => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }

      if (product) { // product already in cart, increase quantity
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(prodId); // find product if not in cart.
    })
    .then(product => {
        // Connect product to a cart by adding a line to cartItems.
      return fetchedCart.addProduct(product, { // magic method sequelize
        through: { quantity: newQuantity }
      });
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.getCart()
    .then(cart => {
        return cart.getProducts({ where: {id: prodId }});
    })
    .then(products => {
        const product = products[0];
        // Remove product from cartItem table.
        return product.cartItem.destroy(); // magic sequelize method
    })
    .then(result => {
        res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
    let fetchedCart;
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts();
        })
        .then(products => {
            req.user.createOrder() // magic sequelize
                .then(order => {
                    return order.addProducts(products.map(product => { // magic sequelize
                        // Product list with orderItem filled out...
                        product.orderItem /* name of sequelize table.*/ = {
                             quantity: product.cartItem.quantity 
                            };
                        return product;
                    }));
                })
                .catch(err => console.log(err)); 
            //console.log(products);
        })
        .then(result => {
            // Magic sequelize function.
            return fetchedCart.setProducts(null);
        })
        .then(result => {
            res.redirect('/orders');
        })
        .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {

    /*
        Include tells sequelize to return the products per order along with orders... 
        'products' is plural because sequelize plurals the names you give it..
        Only works because of the relationship defined in app.js
    */
    req.user.getOrders({include: ['products']}) // magic sequelize method...
        .then(orders => {
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders: orders
            });
        })
        .catch(err => console.log(err));

};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
