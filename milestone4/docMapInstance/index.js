const express = require('express');
const Y = require('yjs');
const app = express();

const port = 3000;
let docMap = new Map();
let list     = [];
//also here we are going to define top 10 list which is entirely done in memory, but how do we know whether or not the document has been
//recently edited?? Our queue will have to handle this
app.post('/add', (req,res) => {
    let obj = {
        name: req.body.name,
        doc: new Y.Doc()
    }
    let id =    
    docMap.set(id, obj);
    top10.splice(0,0,{id: });
    res.json("success!");
})

app.delete('/delete', (req,res) => {
    let {id} = req.body;
    docMap.delete(id);
    top10.filter()
})

// every route under this comment might not be needed at all
add.get('/name', (req,res) => {
    //give name of the doc with id to user
})

add.get('/doc', (req,res)=> {
    //send document contents over
})

add.get('/text', (req,res) => {
    //send text of document over this one might not be needed...
})

app.get('/list', (req,res) =>{
    res.json({list: top10});
})


app.listen(port, ()=> {
    console.log(`app is listening on port ${port}`)
})