const Y = require('yjs');
const docMap = new Map();
const client = require('../db/elasticSearch')
const recent = [];

setInterval(() => {
    let arr = [];
    for(let i = 0; i<recent.length; i++){ 
        let head = {
            update: {_index: "milestone3", _id: recent[i].id}
        }
        let body = {
            text: docMap.getText(element.id)
        };
        arr.push(head);
        arr.push(body);  
    }
    await client.bulk({
        body: arr
    })
    recent = [];
}, 1500);

const getDoc = (id) => {
    if(!docMap.has(id)){
        docMap.set(id, new Y.Doc());
    }

    return docMap.get(docMap.get(id));
}

const edited = (id) => {
    for(let i = 0; i<recent.length; i++){
        if(recent[i].id == id){
            return;
        }
    }
    recent.push(id);
}

module.exports = {
    getDoc,

}