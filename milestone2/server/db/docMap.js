const Y = require('yjs');
const docMap = new Map();
const top10 = require('./top10list');
let id = 0;

docAdd = (name) => {
    let obj = {
        name: name,
        doc: new Y.doc()
    };
    docMap.set(id, obj);
    
    top10.add(id, name);
    
    let temp = id;
    id++;
    return temp;
}

docDelete = (id) => {
    top10.delete(id);

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