const express = require('express')
const router = express.Router()
const api = require('../Controllers/api')


router.get('/connect', api.connect );
router.post('/op', api.op);
router.post('/presence', api.presence);


modules.export = router;