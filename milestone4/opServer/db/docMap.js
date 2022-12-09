const Y = require('yjs');
const docMap = new Map();
const client = require('./elasticClient')
let recent = [];

const helper = (arr) => {
    let found = [];
    arr.forEach(element=> {
        if(found.indexOf(element)===-1 && element.length>4){
            found.push(element);
        }
    })

    return found;
}

setInterval(() => {
    if(recent.length == 0){
        return;
    }
    let arr = [];
    for(let i = 0; i<recent.length; i++){ 
        let str = docMap.get(recent[i]).getText('quill').toString();
        let head = {
            index: {_index: "milestone3", _id: recent[i]}
        }
        let body = {
            text: str,
            suggest: helper(str.split(/[\n ]+/))
        };
        arr.push(head);
        arr.push(body);  
    }
    client.bulk({
        body: arr
    })
    recent = [];
}, 10000);

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
