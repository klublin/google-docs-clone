const express = require('express')
const cors = require('cors')
const redis = require('redis');
const session = require('express-session')
const redisStore = require('connect-redis')(session);
const client  = redis.createClient({
    legacyMode: true
});
const path = require('path');

client.connect().then(()=>{
    console.log("connected to Redis!");
});

// CREATE OUR SERVER
const app = express()
app.use(express.static('public'));
app.use(cors({credentials: true, origin: 'http://plzwork.cse356.compas.cs.stonybrook.edu'}))
app.use(express.json())
const db = require('./db'); 
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.set('trust proxy', true);
app.use(session({
    secret: 'IHATETHISCLASS1023847&',
    // create new redis store.
    store: new redisStore({ host: 'localhost', port: 6379, client: client}),
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



const apiRouter = require('./routes/apiRoutes.js');
app.use('/api', isAuthenticated, apiRouter)
const userRouter = require('./routes/userRoutes.js');
app.use('/users', userRouter);

const collectionRouter = require('./routes/collectionRoutes.js');
app.use('/collection', isAuthenticated, collectionRouter);

const mediaRouter = require('./routes/mediaRoutes');
app.use('/media', isAuthenticated, mediaRouter);

app.use(express.static("public"));

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname,'public/index.html'));
})
app.get('/edit/:id', (req,res) =>{
    console.log(req.session);
    if(req.session.cookie && req.session.key){
        console.log("YAY!");
        res.sendFile(path.join(__dirname,'public/index.html'));
    }
    else{
        console.log("pain pkeo??");
        res.json({error: true, message: "cookies not set"})
    }
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

//BTW THE /HOME ROUTE WILL ONLY REALLY BE USED FOR THE FRONTEND, WE DON'T HAVE TO SERVE IT OUT OF THE BACKEND
//get library route defined here


const port = 3001;
app.listen(port, () => {
    console.log(`App listening on ${port}`)
})

