const path = require('path');

const express = require('express');
const router = express.Router();

const productController = require('../controllers/products');
const rootDir = require('../util/path');
/*
    Mini-express app which can be exported.
*/

router.get('/add-product', productController.getAddProduct); 
router.post('/add-product', productController.postAddProduct);

module.exports = router;