const { Client } = require('@elastic/elasticsearch') 

const client = new Client({
    cloud: {
        id: "milestone4:dXMtZWFzdDQuZ2NwLmVsYXN0aWMtY2xvdWQuY29tJDM3YTg1MzIxMzQ0ZDQ4NGY5MmU0ODY2OGU4ZTFiYmZhJDc1N2VmNDQ2ZmUzZjRhYmM5NGNkOGYzYWM5MTcwNjZk"
    },
    auth: {
        username: "elastic",
        password: "pZQFEceYTwtCJNnbQgOOdWsE"
    }
})
client.info().then(response => console.log("Connected to ES cloud!")).catch(error => console.log(error));

module.exports = client;