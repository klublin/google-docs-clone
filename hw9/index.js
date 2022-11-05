const express = require('express')
const app = express();
var Memcached = require('memcached');
var memcached = new Memcached();
var mysql = require('mysql2');


memcached.connect( 'localhost:11211', function( err, conn ){
    if( err ) console.log( err );
    else console.log( 'connected to memcache!' );
});
const port = 3000;
var connection = mysql.createConnection({
  host     : 'localhost',
  port : '/var/run/mysqld/mysqld.sock',
  user     : 'root',
  password : 'password',
  database: 'hw9'
});

connection.connect(function(err) {
    if(err)
        console.log(err);
    else{
        console.log("Connected!");
    }
})


app.get('/hw9', (req,res) => {
    let param = req.query.player;
    let paramKey = param.replace(/\s/g, '');
    memcached.get(paramKey, function (err, data){
        console.log(data);
        if(data!==undefined){
            res.json({
                players: data
            })
            return;
        }
        else{
            let query = 'select A.Player as p1,B.Player as p2,C.Player as p3,D.Player as p4 from assists A, assists B, assists C, assists D where A.POS=B.POS and B.POS=C.POS and C.POS=D.POS and A.Club<>B.Club and A.club<>C.Club and A.Club<>C.Club and A.Club<>D.Club and B.Club<>C.Club and B.Club<>D.Club and C.Club<>D.Club and A.Player=' + connection.escape(param) + 'order by A.A+B.A+C.A+D.A desc, A.A desc, B.A desc, C.A desc, D.A desc, p1, p2, p3, p4 limit 1;'
            connection.query(query,
                function(err, results, fields){
                    let arr = [];
                    Object.entries(results[0]).forEach(([key,value])=>{
                        arr.push(value);
                    })
                    memcached.set(paramKey, arr, 100, function(err){
                    console.log(err);
                    })
                    res.json({
                        players: arr
                    })
                }
            )
        }
    })
    
})



app.listen(port, () => {
    console.log(`App listening on ${port}`)
  })