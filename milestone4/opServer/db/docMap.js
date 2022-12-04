const Y = require('yjs');
const docMap = new Map();
const client = require('./elasticClient')
let recent = [];

setInterval(() => {
    if(recent.length == 0){
        return;
    }
    let arr = [];
    for(let i = 0; i<recent.length; i++){ 
        let head = {
            update: {_index: "milestone3", _id: recent[i]}
        }
        let body = {
            doc: {text: docMap.get(recent[i]).getText('quill').toString()}
        };
        arr.push(head);
        arr.push(body);  
    }
    console.log(arr);
    client.bulk({
        body: arr
    })
    recent = [];
}, 2000);

const getDoc = (id) => {
    if(!docMap.has(id)){
        docMap.set(id, new Y.Doc());
    }

    return docMap.get(id);
}

const edited = (id) => {
    for(let i = 0; i<recent.length; i++){
        if(recent[i] == id){
            return;
        }
    }
    recent.push(id);
}

module.exports = {
    getDoc,
    edited

}