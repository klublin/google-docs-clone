const { Client } = require('@elastic/elasticsearch') 

const client = new Client({
    node: 'http://209.94.57.93:9200'
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
    found.push({docid: arr[0]._id, name: arr[0]._source.name, snippet: temp});
    return found;
}

const search = async (req,res) => {
    const {q} = req.query;
// if(cache.has(q)){
    //     res.json(cache.get(q));
    //     return;
    // }
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
    //res.json(result.hits.hits);
    let arr = result.hits.hits;
    let thing = parse(arr);
    // if(arr.length!=0){
    //     cache.set(q, thing);
    // }
    res.json(thing);
}

const suggest = async (req,res) => {
    const {q} = req.query;
    // if(cache.has(q)){
    //     res.json(cache.get(q));
    //     return;
    // }
    const result = await client.search({
        index: "milestone3",
        body: {
            "_source": false,
            suggest: {
                "mySuggestion": {
                    prefix: q,
                    completion: {
                        field: "suggest",
                        size: 5
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
		        refresh_interval: '1.5s'
	        },
            "analysis": {
                "filter": {
                    "length_filter": {type: "length", min: 4}
                }
                "analyzer": {
                    "my_analyzer": {
                        "tokenizer": "whitespace",
                        "filter": [ "stop", "kstem", "lowercase", "length_filter"]
                    },
                    "length": {
                        "filter": ["length_filter"]
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
                    type: "completion",
                    analyzer: "length"
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
