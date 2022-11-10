const express = require('express')
const router = express.Router()
const user = require('../Controllers/users');

router.post('/signup', user.signup);
router.post('/login', user.login);
router.post('/logout', user.logout);
router.get('/verify', user.verify);

modules.export = router;