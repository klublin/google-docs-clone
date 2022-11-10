const express = require('express')
const cors = require('cors')

// CREATE OUR SERVER
const app = express()
app.use(cors())
app.use(express.json())


const map = {};




const db = require('./db'); 
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


const router = require('./routes');





app.listen(port, () => {
    console.log(`App listening on ${port}`)
})

