const path = require('path');

const express = require('express');
const router = express.Router();

// routes that start with / on GET requests.
router.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'shop.html'));
});

module.exports = router;