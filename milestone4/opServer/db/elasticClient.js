const { Client } = require('@elastic/elasticsearch') 

const client = new Client({ node: 'http://209.151.155.111:9200'})
client.info().then(response => console.log("Connected to ES cloud!")).catch(error => console.log(error));

module.exports = client;
