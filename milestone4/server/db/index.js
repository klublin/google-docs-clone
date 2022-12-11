const mongoose = require('mongoose')

//need to change to remote ip maybe??
mongoose
    .connect('mongodb://194.113.75.0:27017/users')
    .catch(e => {
        console.error('Connection error', e.message)
    })

const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function(){
    console.log("Connected Successfully");
});

module.exports = db
