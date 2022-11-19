const express = require('express')
const router = express.Router()
const index = require('../Controllers/elastic')


router.get('/search', index.search);
router.get('/suggest', index.suggest);

module.exports = router;