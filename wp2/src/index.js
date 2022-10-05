const mail = require('nodemailer');
const apiKey = require('generate-api-key');
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const port = 3000
const User = require('./db/users.js');

//middleware to parese json i g 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//view engine is ejs
app.set('view engine','ejs');

mongoose.connect('mongodb://localhost:27017/users');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
    console.log("Connected successfully");
});

let transporter = mail.createTransport({
	sendmail: true,
	newline: 'unix',
	path: '/usr/sbin/sendmail',
})

//where my static content goes, basicaly frontend is in here
app.use(express.static(__dirname + '../public'));

app.get('/', (req, res) => {
    res.render('../public/page.ejs');
})

app.post('/adduser', async (req,res) => {
    const check = await User.findOne({ username : req.body.user});
    const emailCheck = await User.findOne({email: req.body.email});
    if(check!==null || emailCheck!==null){
        res.json({"status": "ERROR"});
    }
    else{
        let verify = apiKey.generateApiKey();
        const newUser = await User.create({
            username: req.body.user,
            password: req.body.pass,
            email: req.body.email,
            key: verify
        });
        let link ='thebadbeginning.cse356.compas.cs.stonybrook.edu/verify?email=' + req.body.email + '&key=' + verify;
        transporter.sendMail({
          to: req.body.email,
          from: 'Kevin <root@thebadbeginning.cse356.compas.cs.stonybrook.edu>',
          subject: 'Verification email',
          html: "<a href="+link+">link</a>"
        });
        res.json({"status": "OK"});
    }
})

app.get('/verify', async(req,res) => {
  console.log("req params are... ");
  console.log(req.query);

  let checkDB = await User.findOne({key: req.query.key});
  console.log(checkDB);
  if(checkDB===null){
    res.send({"status": "ERROR"});
  }
  else{
    res.json({"status": "OK"});
    res.render('../public/welcome.ejs');
  }
})


app.listen(port, () => {
  console.log(`App listening on ${port}`)
})