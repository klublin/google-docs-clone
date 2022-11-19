const docMap = require('../db/docMap'); 
const list = require('../db/top10List'); 
const client = require('../db/elasticSearch')


updateIndex = async () => {
    let arr = list.toJson();
    console.log(arr);
    for(const element of arr){
        await client.index({
            index: "milestone3", 
            body: {
                name: element.name,
                text: docMap.getText(element.id)
            }
        })
        console.log(docMap.getText(element.id));
    }
}


const search = async (req,res) => {
    console.log("please man");
    updateIndex();
    const {q} = req.query;
    const result = await client.search({
        body: {
            query: {
                "bool": {
                    "should": [
                    {
                        "match": {
                            "name": q 
                        }
                    },
                    {
                        "match": {
                            "text": q
                        }
                    }]
                }
            },
            "highlight" :{
                "fields" : {
                    "name" : {},
                    "text" : {}
                }
            }
        }
    })

    res.json({result: result});
}

const suggest = (req,res) => {
    updateIndex();
}

module.exports = {
    search,
    suggest
}