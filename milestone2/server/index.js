const express = require('express')
const cors = require('cors')
const redis = require('redis');
const session = require('express-session')
const redisStore = require('connect-redis')(session);
const client  = redis.createClient({
    legacyMode: true
});

client.connect().then(()=>{
    console.log("connected to Redis!");
});

// CREATE OUR SERVER
const app = express()
app.use(express.static('public'));
app.use(cors({credentials: true, origin: 'http://kevwei.cse356.compas.cs.stonybrook.edu:3000'}))
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


const apiRouter = require('./routes/apiRoutes.js');
app.use('/api', apiRouter)
const userRouter = require('./routes/userRoutes.js');
app.use('/users', userRouter);

const collectionRouter = require('./routes/collectionRoutes.js');
app.use('/collection', collectionRouter);

const mediaRouter = require('./routes/mediaRoutes');
app.use('/media', mediaRouter);


app.get('/', (req,res) => {
    
})

app.get('/home', (req,res) => {
    res.redirect('/');
})

app.get('/imageupload', (req,res) => {
    console.log("HELLO????");
    res.sendFile(__dirname + '/public/form.html')
})
//BTW THE /HOME ROUTE WILL ONLY REALLY BE USED FOR THE FRONTEND, WE DON'T HAVE TO SERVE IT OUT OF THE BACKEND
//get library route defined here


const port = 3001;
app.listen(port, () => {
    console.log(`App listening on ${port}`)
})

