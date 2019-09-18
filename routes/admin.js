const express = require('express');
const router = express.Router();

const productController = require('../controllers/products');
/*
    Mini-express app which can be exported.
*/

router.get('/add-product', productController.getAddProduct); 
router.post('/add-product', productController.postAddProduct);

router.get('/admin/add-product', productController.getAddProduct);
router.get('/products', productController.getAddProduct);

module.exports = router;