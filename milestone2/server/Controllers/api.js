const Y = require('yjs')
const docMap = require('../db/docMap');
const list = require('../db/top10List');

const map = {};

connect = (req,res) => {
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
      };
    res.writeHead(200, headers);
    if(map[req.params.id] !== undefined){
        map[req.params.id].clients.push(res);
    }
    else{   
        let obj ={
            clients: [res]
        }
        map[req.params.id] = obj;
    }
    res.socket.on('end', function(res){
        let arr = map[req.params.id].clients;
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
    let arr = map[req.params.id].clients;
    Y.applyUpdate(docMap.getDoc(req.params.id), Uint8Array.from(req.body));
    let string = JSON.stringify(req.body);
    for(let i = 0; i<arr.length; i++){
        arr[i].write('event: update\ndata: ' + `${string}\n\n`);
    } 
    res.status(200).send("update posted");
}

presence = (req,res) => {
    console.log(req.body);
    let arr = map[req.params.id].clients;
    let string = {
        id: req.sessionID,
        name: docMap.getName(req.params.id),
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


module.exports ={
    connect,
    op,
    presence
}