const express = require('express');
const router = express.Router();

const productController = require('../controllers/products');

// routes that start with / on GET requests. // This is a "controller" connects view with model.
router.get('/', productController.getProducts);

module.exports = router;