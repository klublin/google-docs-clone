const docMap = require('../db/docMap'); 
const list = require('../db/top10List'); 
const client = require('../db/elasticSearch')


updateIndex = async () => {
    let q = list.toQueue(); 
    for(const element of q){ 
        await client.index({
            index: "milestone3",
            id: element.id, 
            body: {
                name: element.name,
                text: docMap.getText(element.id)
            }
        })
    }
    if(q.length!=0){
        emptyQueue();
        await client.indices.refresh({index: 'milestone3'})
    }
}


const search = async (req,res) => {
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
            arr[i].highlight.name[0];
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
    updateIndex();
    const {q} = req.query;
    const size = q.length+1;
    const result = await client.search({
        index: "milestone3",
        body: {
            suggest: {
                "my-suggest" : {
                    text: q,
                    "term": {
                        "field": "text",
                        "suggest_mode": "missing",
                        "min_word_length": size
                    }
                }
            }
        }
    })
    console.log(result);
    res.json({result: result});
}

module.exports = {
    search,
    suggest
}