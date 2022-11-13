const express = require('express')
const Y = require('yjs')
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser')
const docMap = require('../db/docMap');
const list = require('../db/top10List');

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

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
    })
    let string = JSON.stringify(Array.from(Y.encodeStateAsUpdate(docMap.getDoc(req.params.id))));
    res.write('event: sync\ndata: ' + `${string}\n\n`);
}

op = (req,res) => { 
    let arr = map[req.params.id].clients;
    Y.applyUpdate(docMap.get(req.params.id).doc, Uint8Array.from(req.body));
    let string = JSON.stringify(req.body);
    for(let i = 0; i<arr.length; i++){
        arr[i].write('event: update\ndata: ' + `${string}\n\n`);
    } 
    res.status(200).send("update posted");
}

presence = (req,res) => {
    let arr = map[req.params.id].clients;
    let string = {
        id: req.sessionID,
        name: docMap.getName(id),
        cursor:{
            index : req.body.index,
            length : req.body.length
        }
    }
    arr.forEach(client => {
        client.write(`event: presence\ndata: ${JSON.stringify(string)}\n\n`)
    })
}


module.exports ={
    connect,
    op,
    presence
}