const Y = require('yjs');
const docMap = new Map();
const top10 = require('./top10List');
const client = require('../db/elasticSearch')

docAdd = async (name) => {
    let newDoc = new Y.Doc();
    let newText = newDoc.getText('quill');
    let obj = {
        name: name,
        doc: newDoc,
        text: newText
    };
    let id = await client.index({
        index: "milestone3",
        body: {
            name: name,
            text: newText
        }
    })
    docMap.set(id._id, obj);
    
    top10.listAdd(id._id, name);
    
    return id._id;
}

docDelete = (deleteID) => {
    top10.listDelete(deleteID);

    return docMap.delete(deleteID);
}

getName = (nameID) => {
    return docMap.get(nameID).name;
}

getDoc = (docID) => {
    return docMap.get(docID).doc;
}

getText = (docID) =>{
    console.log(docID);
    return docMap.get(docID).text.toString();
}


module.exports = {
    docAdd,
    docDelete,
    getName,
    getDoc,
    getText
}