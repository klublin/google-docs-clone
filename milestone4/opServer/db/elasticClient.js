const { Client } = require('@elastic/elasticsearch') 

const client = new Client({ node: 'http://209.94.56.105:9200'})
client.info().then(response => console.log("Connected to ES!")).catch(error => console.log(error));

module.exports = client;
