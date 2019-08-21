const express = require('express');

const router = express.Router();

// routes that start with / on GET requests.
router.get('/', (req, res, next /*func*/) => {
    res.send('<h1>Hello from Express!</h1>')
});

module.exports = router;