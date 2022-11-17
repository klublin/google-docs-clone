const express = require('express')
const router = express.Router()
const collections = require('../Controllers/collection')


router.post('/create', collections.createDoc);
router.post('/delete', collections.deleteDoc);
router.get('/list', collections.listDocuments);

module.exports = router;