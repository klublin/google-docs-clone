const express = require('express')
const Y = require('yjs')
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser')

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const map = {};


create = (req,res) => {

}

delete = (req,res) => {

}

list = (req,res) => {

}


module.export ={
    create, 
    delete, 
    list
}