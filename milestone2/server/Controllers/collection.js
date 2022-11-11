const express = require('express')
const Y = require('yjs')
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser')

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const docMap = new Map();
let id = 0;
    
create = (req,res) => {
    let {name} = req.body;
    
    if(docMap.get(name)!==null){
        res.status(200).json({error: true, messsage: "doc already exists!"});
        return;
    }
    let obj = {
        name: name,
        doc: new Y.doc()
    }
    docMap.set(id, obj);

    res.status.json({id: id});
    id++;
}

delete = (req,res) => {
    let {id} = req.body
    docMap.delete(id);
    res.status(200).json({});
}

list = (req,res) => {

    res.status(200).json([{

    }])
}


module.export ={
    create, 
    delete, 
    list
}