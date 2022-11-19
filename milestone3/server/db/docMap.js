const Y = require('yjs');
const docMap = new Map();
const top10 = require('./top10List');
let id = 1;

docAdd = (name) => {
    let newDoc = new Y.Doc();
    let newText = newDoc.getText('quill');
    let obj = {
        name: name,
        doc: newDoc,
        text: newText
    };
    docMap.set(id, obj);
    
    top10.listAdd(id, name);
    
    let temp = id;
    id++;
    return temp;
}

docDelete = (deleteID) => {
    top10.listDelete(deleteID);

    return docMap.delete(Number(deleteID));
}

getName = (nameID) => {
    return docMap.get(Number(nameID)).name;
}

getDoc = (docID) => {
    return docMap.get(Number(docID)).doc;
}

getText = (docID) =>{
    return docMap.get(Number(docID)).text.toString;
}


module.exports = {
    docAdd,
    docDelete,
    getName,
    getDoc,
    getText
}