const express = require('express');
const router = express.Router();

const shopController = require('../controllers/shop');

// routes that start with / on GET requests. // This is a "controller" connects view with model.
router.get('/', shopController.getHomePage); // getIndex
router.get('/products', shopController.getProducts);

// Look for a variable value productId. Can match any string..
router.get('/products/:productId', shopController.getProduct);

router.get('/cart', shopController.getCart);
router.post('/cart', shopController.postCart);

router.get('/orders', shopController.getOrders);
router.get('/checkout', shopController.getCheckout);


module.exports = router;