//THIS IS PROBABLY NO LONGER NEEDED

const { Client } = require('@elastic/elasticsearch') 
const docMap = require('../db/docMap'); 
const client = new Client({
    node: 'http://localhost:9200'
})

module.exports = client;