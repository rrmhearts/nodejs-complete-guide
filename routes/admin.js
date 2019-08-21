const express = require('express');

const router = express.Router();
/*
    Mini-express app which can be exported.
*/

router.get('/add-product', (req, res, next /*func*/) => {
    res.send('<form action="/product" method="POST"><input type="text" name="title"> \
        <button type="submit>Add Product</button></input></form>');
}); // add a new middleware function

router.post('/product', (req, res) => {
    console.log(req.body);
    res.redirect('/');
});

module.exports = router;