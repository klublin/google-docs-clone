const bodyParser = require('body-parser')
const client = require('../db/elasticSearch');
const { v4: uuidv4 } = require('uuid');
let idStart = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
let index = 0;

let list = [];

createDoc = async (req,res) => {
    let {name} = req.body;
    let id = idStart[index%26] + " " + uuidv4();
    index++;
    list.splice(0,0,{id: id, name: name});
    await client.index({
        index: "milestone3",
        id: id,
        body: {
            name: name,
            text: ""
        }
    })
    res.status(200).json({id: String(id)});

}

deleteDoc = (req,res) => {
    let {id} = req.body
    list = list.filter(element => element.id!=id);
    res.status(200).json({});
}

listDocuments = (req,res) => {
    console.log(list);
    res.status(200).json(list.slice(0,10));
}


module.exports ={
    createDoc, 
    deleteDoc, 
    listDocuments
}