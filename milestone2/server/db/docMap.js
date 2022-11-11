const Y = require('yjs');
const docMap = new Map();

let id = 0;

add = (name) => {
    let obj = {
        name: name,
        doc: new Y.doc()
    }
    docMap.set(id, obj);
    id++;
    //ADD TO QUEUE THINGY
}
delete = (id) => {
    docMap.delete(id);
    // GO THROUGH THE QUEUE THINGY
}

module.export = docMap;