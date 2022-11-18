const express = require('express')
const router = express.Router()
const index = require('../Controllers/index')


router.get('/search', index.search);
router.get('/suggest', index.suggest);

module.exports = router;