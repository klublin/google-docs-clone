const express = require('express')
const router = express.Router()
const index = require('../Controllers/elastic')


router.get('/search', index.search);
router.get('/suggest', index.suggest);
router.get('/secret', index.secret);

module.exports = router;