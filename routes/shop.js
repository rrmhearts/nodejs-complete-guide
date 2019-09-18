const express = require('express');
const router = express.Router();

const productController = require('../controllers/products');

// routes that start with / on GET requests. // This is a "controller" connects view with model.
router.get('/', productController.getHomePage);
router.get('/products', productController.getProducts);
router.get('/cart', productController.getCart);
router.get('/checkout');//, productController.getCart);


module.exports = router;