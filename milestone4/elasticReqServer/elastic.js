const { Client } = require('@elastic/elasticsearch') 
const memjs = require('memjs')

const client = new Client({
    cloud: {
        id: "milestone4:dXMtZWFzdDQuZ2NwLmVsYXN0aWMtY2xvdWQuY29tJDM3YTg1MzIxMzQ0ZDQ4NGY5MmU0ODY2OGU4ZTFiYmZhJDc1N2VmNDQ2ZmUzZjRhYmM5NGNkOGYzYWM5MTcwNjZk"
    },
    auth: {
        username: "elastic",
        password: "pZQFEceYTwtCJNnbQgOOdWsE"
    }
})

client.info().then(response => console.log("connected to ES cloud!")).catch(error => console.log(error));

var memcached = memjs.Client.create('194.113.75.76:11211');

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
    if(!arr[0]){
	return [];
    }
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
    const buffer = await memcached.get(q);
    if(buffer.value!== null){
        let response = JSON.parse(buffer.value.toString());
        res.json(response);
        return;
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
    await memcached.set(q, JSON.stringify(thing), {expires: 5});
    res.json(thing);
}

const suggest = async (req,res) => {
    const {q} = req.query;
    const buffer = await memcached.get(q);
    if(buffer.value!== null){
        let response = JSON.parse(buffer.value.toString());
        res.json(response);
        return;
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
    await memcached.set(q, JSON.stringify(done), {expires: 5});
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
		        refresh_interval: '20s',
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
