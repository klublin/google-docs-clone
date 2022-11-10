const express = require('express')
const router = express.Router()
const collections = require('../Controllers/collection')


router.post('/create', collections.create);
router.post('/delete', collections.delete);
router.get('/list', collections.list);

modules.export = router;