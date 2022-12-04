const express = require('express')
const Y = require('yjs')
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')
const port = 3001;
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const map = {};
app.get('/api/connect/:id', (req,res) =>{
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
    console.log('THIS IS A CONNECT CHECK HELLO MY HONEY');
    console.log(map[req.params.id].doc.getText('quill').toString());
    let string = JSON.stringify(Array.from(Y.encodeStateAsUpdate(map[req.params.id].doc)));
    res.write('event: sync\ndata: ' + `${string}\n\n`);
})
app.post('/api/op/:id', (req,res) =>{ 
    console.log("hmm");
    let arr = map[req.params.id].clients;
    Y.applyUpdate(map[req.params.id].doc, Uint8Array.from(req.body));
    console.log(map[req.params.id].doc.getText('quill').toString());
    let string = JSON.stringify(req.body);
    for(let i = 0; i<arr.length; i++){
        arr[i].write('event: update\ndata: ' + `${string}\n\n`);
    } 
    res.status(200).json({});
})

app.use(express.static('../app/build'))
app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, '../app/build/index.html'))
})


app.listen(port, () => {
    console.log(`App listening on ${port}`)
})

