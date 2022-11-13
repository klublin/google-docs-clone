const Y = require('yjs');
const docMap = new Map();
const top10 = require('./top10List');
let id = 0;

docAdd = (name) => {
    const document = new Y.Doc();
    let obj = {
        name: name,
        doc: document
    };
    docMap.set(id, obj);
    
    top10.listAdd(id, name);
    
    let temp = id;
    id++;
    return temp;
}

docDelete = (id) => {
    top10.listDelete(id);

    return docMap.delete(id);
}

getName = (id) => {
    return docMap.get(id).name;
}

getDoc = (id) => {
    return docMap.get(id).doc;
}

module.exports = {
    docAdd,
    docDelete
}