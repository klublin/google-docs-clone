const express = require('express')
const router = express.Router()
const api = require('../Controllers/api.js')


router.get('/connect/:id', api.connect);
router.post('/op/:id', api.op);
router.post('/presence/:id', api.presence);


module.exports = router;