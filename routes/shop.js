const path = require('path');

const express = require('express');
const router = express.Router();

const rootDir = require('../util/path');

// routes that start with / on GET requests.
router.get('/', (req, res, next) => {
    res.sendFile(path.join(rootDir, 'views', 'shop.html'));
});

module.exports = router;