const docMap = require('../db/docMap'); 
const list = require('../db/top10List'); 
const client = require('../db/elasticSearch')


updateIndex = async () => {
    let arr = list.toJson(); 
    
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
                name: {
                    type: "text",
                    analyzer: "my_analyzer"
                },
                text: {
                    type: "text",
                    analyzer: "my_analyzer"
                }
            }
        }
    });
    for(const element of arr){ 
        await client.index({
            index: "milestone3", 
            body: {
                name: element.name,
                text: docMap.getText(element.id)
            }
        })
    }
    await client.indices.refresh({index: 'milestone3'})
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

    res.json({result: result.hits.hits});
}

const suggest = (req,res) => {
    updateIndex();
}

module.exports = {
    search,
    suggest
}