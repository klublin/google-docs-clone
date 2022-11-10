const express = require('express')
const Y = require('yjs')
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser')

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const map = {};


connectApi = (req,res) => {
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
        const ydoc = new Y.Doc();
        let obj ={
            clients: [res],
            doc: ydoc
        }
        map[req.params.id] = obj;
    }
    res.socket.on('end', function(res){
        let arr = map[req.params.id].clients;
        arr.splice(arr.indexOf(res), 1);
    })
    let string = JSON.stringify(Array.from(Y.encodeStateAsUpdate(map[req.params.id].doc)));
    res.write('event: sync\ndata: ' + `${string}\n\n`);
}

addCharacter = (req,res) => { 
    let arr = map[req.params.id].clients;
    Y.applyUpdate(map[req.params.id].doc, Uint8Array.from(req.body));
    let string = JSON.stringify(req.body);
    for(let i = 0; i<arr.length; i++){
        arr[i].write('event: update\ndata: ' + `${string}\n\n`);
    } 
    res.status(200).send("update posted");
}


module.export ={
    connectApi,
    addCharacter
}