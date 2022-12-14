const bodyParser = require('body-parser')
const client = require('../db/elasticSearch');
const { v4: uuidv4 } = require('uuid');
let idStart = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']

let list = [];

createDoc = async (req,res) => {
    let {name} = req.body;
    let id = uuidv4();
    list.splice(0,0,{id: id, name: name});
    console.log(id);
    res.status(200).json({id: String(id)});

}

deleteDoc = (req,res) => {
    let {id} = req.body
    list = list.filter(element => element.id!=id);
    res.status(200).json({});
}

listDocuments = (req,res) => {
    res.status(200).json(list.slice(0,10));
}


module.exports ={
    createDoc, 
    deleteDoc, 
    listDocuments
}
