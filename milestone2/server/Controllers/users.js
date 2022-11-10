const express = require('express')
const Y = require('yjs')
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser')

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const map = {};


signup = (req,res) => {

}

login = (req, res) => {

}

logout = (req, res) => {

}

verify = (req, res) => {

}


module.export ={
    signup, 
    login, 
    logout,
    verify
}