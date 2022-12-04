const express = require('express');
const app = express();
const redis = require('redis');
const session = require('express-session')
const redisStore = require('connect-redis')(session);
const client  = redis.createClient({
    legacyMode: true, 
    url: 'redis://209.151.155.129:6379'
});
client.connect().then(()=>{
    console.log("connected to Redis!");
})

const api = require('./api.js');
const port = 3000;
app.use(express.json())
app.use(session({
    secret: 'IHATETHISCLASS1023847&',
    store: new redisStore({client: client}),
    saveUninitialized: true,
    resave: false,
    cookie: {sameSite: true }
}));

function isAuthenticated (req, res, next) {
    if (req.session.key) {
        next();
    }
    else res.status(200).json({error: true, message: ""});
}
var router = express.Router();
app.use('/api', router);
router.post('/op/:id', isAuthenticated, api.op);

router.get('/connect/:id', isAuthenticated, api.connect);

router.post('/presence/:id', isAuthenticated, api.presence);

app.listen(port, () => {
    console.log(`App listening on ${port}`)
})