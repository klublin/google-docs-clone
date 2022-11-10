const express = require('express')
const router = express.Router()
const media = require('../Controllers/media')

router.post('/upload', media.upload);
router.get('/access', media.access);

modules.export = router;