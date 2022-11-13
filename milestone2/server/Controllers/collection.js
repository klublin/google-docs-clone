const bodyParser = require('body-parser')
const docMap = require('../db/docMap');
const list = require('../db/top10List');

    
createDoc = (req,res) => {
    let {name} = req.body;
    
    let id = docMap.add(name);
    res.status(200).json({id});
}

deleteDoc = (req,res) => {
    let {id} = req.body
    let check = docMap.delete(id);
    if(!check){
        res.status(200).json({error: true, message: "doc does not exist"});
    }
    else
        res.status(200).json({});
}

listDocuments = (req,res) => {
    let arr = list.toJson();
    
    res.status(200).json(arr);
}


module.exports ={
    createDoc, 
    deleteDoc, 
    listDocuments
}