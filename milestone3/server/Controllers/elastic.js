const docMap = require('../db/docMap'); 
const list = require('../db/top10List'); 
const client = require('../db/elasticSearch')


updateIndex = async () => {
    let q = list.toQueue();
    if(q.length == 0){
        return;
    }
    let arr = [];
    for(const element of q){ 
        let str = docMap.getText(element.id);
        let head = {
            index: {_index: "milestone3", _id: element.id}
        }
        let body = {
            name: element.name,
            text: str,
            suggest: str.split(/[\n ]+/)
        };
        arr.push(head);
        arr.push(body);  
    }
    await client.bulk({
        refresh: "wait_for",
        body: arr
    })
}


const search = async (req,res) => {
    console.log("SEARCH ME");
    updateIndex();
    const {q} = req.query;
    const result = await client.search({
        body: {
            query: {
                bool : {
                    should: [
                        {
                            match: {
                                text : {
                                    query: q
                                }
                            }
                        },
                        {
                            match: {
                                name : {
                                    query: q
                                }
                            }
                        }
                    ]
                }  
            },
            highlight: {
                fields: {
                    text: {},
                    name: {}
                }
            }
        }
    })
    let arr = result.hits.hits;
    let found = [];
    let i = 0;
    while(found.length < 10 && i<arr.length){
        let temp = arr[i].highlight.text;
        if(!arr[i].highlight.text){
            temp = arr[i].highlight.name[0];
        }
        else{
            temp = arr[i].highlight.text[0];
        }
        found.push({docid: arr[i]._id, name: arr[i]._source.name, snippet: temp});
        i++;
    }
    res.json(found);
}

const suggest = async (req,res) => {
    console.log('SUGGEST ME');
    updateIndex();
    const {q} = req.query;
    const result = await client.search({
        index: "milestone3",
        body: {
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
    res.json({"result": done});   
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
                  "filter": [ "stop", "kstem" ]
                }
              }
            }
        },
        mappings: {
            properties: {
                text: {
                    type: "text",
                    analyzer: "my_analyzer",
                },
                name: {
                    type: "text",
                    analyzer: "my_analyzer"
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