const docMap = require('../db/docMap'); 
const list = require('../db/top10List'); 
const client = require('../db/elasticSearch')
const cache = new Map();

updateIndex = async () => {
    cache.clear();
    let q = list.toQueue();
    if(q.length == 0){
        return;
    }
    let arr = [];
    for(const element of q){ 
        let head = {
            index: {_index: "milestone3", _id: element.id}
        }
        let body = {
            name: element.name,
            text: docMap.getText(element.id)
        };
        arr.push(head);
        arr.push(body);  
    }
    await client.bulk({
        body: arr
    })
    await client.indices.refresh({index: "milestone3"});
}

const search = async (req,res) => {
    console.log("SEARCH ME");
    updateIndex();
    const {q} = req.query;
    if(cache.has(q)){
        res.json(cache.get(q));
        return;
    }
    const result = await client.search({
        body: {
            query: {
                "multi_match": {
                    query: q,
                    fields: ["text", "name"]
                }
            },
            highlight: {
                fields: {
                    text: {
                        "boundary_scanner": "sentence",
                        "fragment_size": 0
                    },
                    name: {}
                }
            }
        }
    })
    let arr = result.hits.hits;
    let found = [];
    let i = 0;
    while(found.length < 10 && i<arr.length){
        let temp = arr[i].highlight.text[0];
        if(!arr[i].highlight.text){
            temp = arr[i].highlight.name[0];
        }
        found.push({docid: arr[i]._id, name: arr[i]._source.name, snippet: temp});
        i++;
    }
    if(arr.length!=0){
        cache.set(q, found);
    }
    res.json(found);
}

const suggest = async (req,res) => {
    console.log('SUGGEST ME');
    updateIndex();
    const {q} = req.query;
    if(cache.has(q)){
        res.json(cache.get(q));
        return;
    }
    const result = await client.search({
        index: "milestone3",
        body: {
            prefix: {
                text: {
                    value: q
                }
            }
        }
    })
    let arr = result.suggest.mySuggestion[0].options;

    let done = [];

    arr.forEach(element => {
        done.push(element.text);
    })
    if(arr.length!=0){
        cache.set(q,done);
    }
    res.json(done);   
}


secret = async (req,res) => {
    if(await client.indices.exists({index: "milestone3"})){
        await client.indices.delete({index: "milestone3"});
    }
    await client.indices.create({
        index: "milestone3",
        "settings": {
            "analysis": {
              "analyzer": {
                "my_analyzer": {
                  "tokenizer": "whitespace",
                  "filter": [ "stop", "kstem", "lowercase" ]
                }
              }
            }
        },
        mappings: {
            properties: {
                text: {
                    type: "text",
                    analyzer: "my_analyzer",
                    "index_prefixes": {
                        "min_chars": 4
                    }
                },
                name: {
                    type: "text",
                    analyzer: "my_analyzer"
                }
            }
        }
    });
    res.json("success!");
}

module.exports = {
    search,
    suggest,
    secret
}