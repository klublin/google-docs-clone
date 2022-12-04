const { Client } = require('@elastic/elasticsearch') 

const client = new Client({
    node: 'http://209.94.57.93:9200'
})

module.exports = client;