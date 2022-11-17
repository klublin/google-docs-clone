const express = require('express')
const router = express.Router()
const media = require('../Controllers/media')

router.post('/upload', media.uploadImage);
router.get('/access/:mediaid', media.access);

module.exports = router;