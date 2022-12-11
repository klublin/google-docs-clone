const { Client } = require('@elastic/elasticsearch') 
const client = new Client({
    node: 'http://209.94.56.105:9200'
})

module.exports = client;
