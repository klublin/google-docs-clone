const { Client } = require('@elastic/elasticsearch') 
const Memcached = require('memcached');

const client = new Client({
    node: 'http://209.94.57.93:9200'
})

var memcached = new Memcached('194.113.75.76:11211');

memcached.connect('194.113.75.76:11211', function(err, conn){
    if(err) {
        console.log("THIS IS AN ERROR PLEASE SCREAM");
        console.log(err);
    }
    else{
        console.log('Connected to Memcached!');
    } 
})

const cache = new Map();

// updateIndex = async () => {
//     cache.clear();
//     let q = list.toQueue();
//     if(q.length == 0){
//         return;
//     }
//     let arr = [];
//     for(const element of q){ 
//         let head = {
//             index: {_index: "milestone3", _id: element.id}
//         }
//         let body = {
//             name: element.name,
//             text: docMap.getText(element.id)
//         };
//         arr.push(head);
//         arr.push(body);  
//     }
//     await client.bulk({
//         body: arr
//     })
//     await client.indices.refresh({index: "milestone3"});
// }

const parse = (arr) => {
    let found = [];
    let i = 0;
    let temp = "";
    while(i<arr[0].highlight.text.length){
        temp+=arr[0].highlight.text[i];
        i++;
    }
    found.push({docid: arr[0]._id, name: "Milestone #4", snippet: temp});
    return found;
}

const search = async (req,res) => {
    const {q} = req.query;
    const check = await memcached.get(q);
    console.log(check);
    if(check!== undefined){
        res.json(check);
    }
    const result = await client.search({
        body: {
            "_source": false,
            query: {
                "match": {
		            "text": q
		        }
            },
            highlight: {
                fields: {
                    text: {
			            "fragment_size": 30
			        }
                }
            }
        }
    })
    let arr = result.hits.hits;
    let thing = parse(arr);
    memcached.set(q, thing, 5, function(err){
        if(err) console.log(err);
    });
    res.json(thing);
}

const suggest = async (req,res) => {
    const {q} = req.query;
    console.log(q);
    const check = await memcached.get(q);
    console.log(check);
    if(check!== undefined){
        res.json(check);
    }
    if(check!== undefined){
        res.json(check);
    }
    const result = await client.search({
        index: "milestone3",
        body: {
            "_source": false,
            suggest: {
                "mySuggestion": {
                    prefix: q,
                    completion: {
                        field: "suggest",
                        size: 3
                    }
                }
            }
        }
    })
    let arr = result.suggest.mySuggestion[0].options;
    
    let done = [];
    
    arr.forEach(element => {
        done.push(element.text);
    })
    memcached.set(q, done, 5, function(err){
        if(err) console.log(err);
    });
    res.json(done);
}


secret = async (req,res) => {
    if(await client.indices.exists({index: "milestone3"})){
        await client.indices.delete({index: "milestone3"});
    }
    await client.indices.create({
        index: "milestone3",
        "settings": {
	        "index": {
		        refresh_interval: '30s',
                "number_of_replicas": 0,
                "store": {
                    "preload": ["nvd", "dvd", "tim", "doc", "dim"]  
                }
	        },
            "analysis": {
                "filter": {
                    "length_filter": {type: "length", min: 5}
                },
                "analyzer": {
                    "my_analyzer": {
                        "tokenizer": "whitespace",
                        "filter": [ "stop", "kstem", "length_filter"]
                    }
                }
            }
        },
        mappings: {
            properties: {
                text: {
                    type: "text",
                    analyzer: "my_analyzer",
                    "term_vector": "with_offsets"
                },
                suggest: {
                    type: "completion"
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
