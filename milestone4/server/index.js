const express = require('express')
const cors = require('cors')
const redis = require('redis');
const session = require('express-session')
const redisStore = require('connect-redis')(session);
const client  = redis.createClient({
    legacyMode: true, 
    url: 'redis://194.113.75.0:6379'
});
client.connect().then(()=>{
    console.log("connected to Redis!");
})
const path = require('path');
// CREATE OUR SERVER
const app = express()
app.use(express.static('public'));
app.use(cors({credentials: true, origin: 'http://giveten.cse356.compas.cs.stonybrook.edu'}))
app.use(express.json())
const db = require('./db'); 
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.set('trust proxy', true);
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


const collectionRouter = require('./routes/collectionRoutes.js');
app.use('/collection', isAuthenticated, collectionRouter);

app.get('/edit/:id', (req,res) =>{
    if(req.session.cookie && req.session.key){
        res.sendFile(path.join(__dirname,'public/index.html'));
    }
    else{
        res.json({error: true, message: "cookies not set"})
    }
})
//THESE GUYS WILL BE HANDLED ON MAIN INSTANCE!!!

const userRouter = require('./routes/userRoutes.js');
app.use('/users', userRouter);

const mediaRouter = require('./routes/mediaRoutes');
app.use('/media', isAuthenticated, mediaRouter);

app.use(express.static("public"));

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname,'public/index.html'));
})

app.get('/home', (req,res) => {
    if(req.session.cookie){
        res.sendFile(path.join(__dirname, 'public/index.html'));
    }
    else{
        res.status(200).json({error: true, message: "cookies not set"});
    } 
})

app.use('/library', express.static('dist'))

const port = 3001;
app.listen(port, () => {
    console.log(`App listening on ${port}`)
})
