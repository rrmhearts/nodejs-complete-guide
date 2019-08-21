const express = require('express');

const router = express.Router();
/*
    Mini-express app which can be exported.
*/

// /admin/add-product => GET
router.get(/*/admin*/'/add-product', (req, res, next /*func*/) => {
    res.send('<form action="/admin/add-product" method="POST"><input type="text" name="title"> \
        <button type="submit>Add Product</button></input></form>');
}); // add a new middleware function

// /admin/add-product => POST
router.post(/*/admin*/'/add-product', (req, res) => {
    console.log(req.body);
    res.redirect('/');
});

module.exports = router;