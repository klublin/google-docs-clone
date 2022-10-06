const mail = require('nodemailer');
const apiKey = require('generate-api-key');
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const port = 3000
const User = require('./db/users.js');
const cookieParser = require('cookie-parser')


//used for cookies
app.use(cookieParser());

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
    const check = await User.findOne({ username : req.body.username});
    const emailCheck = await User.findOne({email: req.body.email});
    if(check!==null || emailCheck!==null){
        res.json({"status": "ERROR"});
    }
    else{
        let verify = apiKey.generateApiKey();
        const newUser = await User.create({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            key: verify,
            verifid: false
        });
        let link ='thebadbeginning.cse356.compas.cs.stonybrook.edu/verify?email=' + encodeURIComponent(req.body.email) + '&key=' + encodeURIComponent(verify);
        transporter.sendMail({
          to: req.body.email,
          from: 'Kevin <root@thebadbeginning.cse356.compas.cs.stonybrook.edu>',
          subject: 'Verification email',
          html: "<a href="+link+">"+link+"</a>"
        });
        res.json({"status": "OK"});
    }
})

app.get('/verify', async(req,res) => {
  console.log(req.query);

  let checkDB = await User.findOne({key: req.query.key});
  console.log(req.query.key);
  console.log(checkDB);
  if(checkDB===null){
    res.send({"status": "ERROR"});
  }
  else{
    res.json({"status": "OK"});
  }
})

app.post('/login', async(req,res)=>{
  const checkValidUser = await User.findOne({username: req.body.username});
  if(checkValidUser!==null){
    if(checkValidUser.password!==req.body.password){
      return res.json({"status": "ERROR"});
    }
    else{
      if(checkValidUser.verified){
        res.cookie('username',req.body.username).send('cookie set');
        res.cookie('password', req.body.password).send('cookie set');
        return res.json({"status":"OK"});
      }
      else{
        return res.json({"status": "ERROR"});
      }
    }
  }
  else{
    return res.json({"status": "ERROR"});
  }
})
app.post('/logout', async(req,res)=>{
  res.clearCookie('username');
  res.clearCookie('password');
})

app.post('/ttt/play', async(req,res)=>{
  let username = req.cookies.username;
  let password = req.cookies.password;

  if(username===null || password ===null){
    res.json({"status" : "ERROR"});
  }
  
  let user = User.findOne({username: username});



})


//THESE ARE STATS!

app.post('/listgames', async (req,res)=>{
  let username = req.cookies.username;

  let user = await User.findOne({username: username});

  if(user===null){
    res.json({"status": "ERROR"});
  }

  let boards = [];

  for(let i = 0; i<user.games.length;i++){
    let temp = {i: user.games.board.createdAt};
    boards.push(temp);
  }

  let response = {
    {"status": "OK"},
    {"games": boards}
  };

  res.json(response);

  
})

app.post('/getgame', async(req,res) => {
  let username = req.cookies.username;
  
  let user = await User.findOne({username: username});

  if(user===null){
    res.json({"status": "ERROR"});
  }


})

app.listen(port, () => {
  console.log(`App listening on ${port}`)
})