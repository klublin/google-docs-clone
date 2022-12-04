const Y = require('yjs')
const Delta = require('quill-delta');
const docMap = require('./db/docMap');
let clients = new Map();

connect = (req,res) => {
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    };
    res.writeHead(200, headers);
    if(clients.has(req.params.id)){
        clients.get(req.params.id).push(res);
    }
    else{   
        clients.set(req.params.id, [res]);
    }
    res.socket.on('end', function(res){
        let arr = clients.get(req.params.id);
        arr.splice(arr.indexOf(res), 1);
        arr.forEach(client => {
            client.write(`event: presence\ndata: {}\n\n`)
        })
    })
    let state = docMap.getDoc(req.params.id);
    let string = JSON.stringify(Array.from(Y.encodeStateAsUpdate(state)));
    res.write('event: sync\ndata: ' + `${string}\n\n`);
}

op = (req,res) => {
    let arr = clients.get(req.params.id);
    Y.applyUpdate(docMap.get(req.params.id), Uint8Array.from(req.body));
    let string = JSON.stringify(req.body);
    for(let i = 0; i<arr.length; i++){
        arr[i].write('event: update\ndata: ' + `${string}\n\n`);
    } 
    docMap.edited(req.params.id);
    res.status(200).send("update posted");
}

presence = (req,res) => {
    let arr = clients.get(req.params.id);
    let string = {
        session_id: req.sessionID,
        name: req.session.name,
        cursor:{
            index : req.body.index,
            length : req.body.length
        }
    }
    arr.forEach(client => {
        client.write(`event: presence\ndata: ${JSON.stringify(string)}\n\n`)
    })
    res.status(200).json({});   
}


module.exports = {
    connect,
    op,
    presence
}