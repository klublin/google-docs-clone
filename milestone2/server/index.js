const express = require('express')
const cors = require('cors')

// CREATE OUR SERVER
const app = express()
app.use(cors())
app.use(express.json())

const db = require('./db'); 
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const apiRouter = require('./routes/apiRoutes');
app.use('/api', apiRouter)

const userRouter = require('./routes/userRoutes');
app.use('/users', userRouter);

const collectionRouter = require('./routes/collectionRoutes');
app.use('/collections', collectionRouter);

const mediaRouter = require('./media/mediaRoutes');
app.use('/media', mediaRouter);


app.get('/', (req,res) => {
    
})

app.get('/home', (req,res) => {

})
//BTW THE /HOME ROUTE WILL ONLY REALLY BE USED FOR THE FRONTEND, WE DON'T HAVE TO SERVE IT OUT OF THE BACKEND
//get library route defined here

app.listen(port, () => {
    console.log(`App listening on ${port}`)
})

