const express = require('express');
const router = express.Router();

const shopController = require('../controllers/shop');

// routes that start with / on GET requests. // This is a "controller" connects view with model.
router.get('/', shopController.getHomePage); // getIndex
router.get('/products', shopController.getProducts);
router.get('/cart', shopController.getCart);
router.get('/checkout', shopController.getCheckout);


module.exports = router;