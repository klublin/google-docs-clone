const express = require('express')
const Y = require('yjs')
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser')

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const map = {};


upload = (req,res) => {

}

access = (req,res) => {

}


module.export ={
    upload,
    access
}