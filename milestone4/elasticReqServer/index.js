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
}).catch("cannot");

const indexAPI = require('./elastic.js');
const port = 3000;

var router = express.Router();


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
app.use('/index',router)

router.get('/search', isAuthenticated, indexAPI.search);

router.get('/suggest', isAuthenticated, indexAPI.suggest);

router.get('/secret', isAuthenticated, indexAPI.secret);

app.listen(port, () => {
    console.log(`App listening on ${port}`)
})