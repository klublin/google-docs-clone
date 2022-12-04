//THIS IS PROBABLY NO LONGER NEEDED

const Y = require('yjs');
const docMap = new Map();
const top10 = require('./top10List');
const client = require('../db/elasticSearch')

docAdd = (name, id) => {
    let newDoc = new Y.Doc();
    let id = await client.index({
        index: "milestone3",
        body: {
            name: name,
            id: id
            text: ""
        }
    })
    docMap.set(id, new Y.Doc());
    
    top10.listAdd(id._id, name);
}

docDelete = (deleteID) => {
    top10.listDelete(deleteID);

    docMap.remove
}

getName = (nameID) => {
    return docMap.get(nameID).name;
}

getDoc = (docID) => {
    return docMap.get(docID).doc;
}

getText = (docID) =>{
    return docMap.get(docID).text.toString();
}


module.exports = {
    docAdd,
    docDelete,
    getName,
    getDoc,
    getText
}