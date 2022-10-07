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
        res.json({status: "ERROR"});
    }
    else{
        //let verify = apiKey.generateApiKey();
        let verify = "DTRnEb8jfdAFDsl4Gsoq.~Qx_7W";
        console.log(verify);
        const newUser = await User.create({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            key: verify,
            verifid: false
        });
        let link ='http://thebadbeginning.cse356.compas.cs.stonybrook.edu/verify?email=' + encodeURIComponent(req.body.email) + '&key=' + encodeURIComponent(verify);
        console.log(link);  
        transporter.sendMail({
          to: "seabook02@hotmail.com",
          from: 'Kevin <root@thebadbeginning.cse356.compas.cs.stonybrook.edu>',
          subject: 'Verification email',
          text: link
        });
        
        res.json({status: "OK"});
    }
})

app.get('/verify', async(req,res) => {
  console.log(req.query);
  let checkDB = await User.findOne({key: req.query.key});
  if(checkDB===null){
    res.send({status: "ERROR"});
  }
  else{
    checkDB.verified = true;
    await checkDB.save();
    res.json({status: "OK"});
  }
})

app.post('/login', async(req,res)=>{
  const checkValidUser = await User.findOne({username: req.body.username});
  console.log(checkValidUser);
  if(checkValidUser!==null){
    if(checkValidUser.password!==req.body.password){
      console.log(checkValidUser.password);
      return res.json({status: "ERROR"});
    }
    else{
      if(checkValidUser.verified){
        res.cookie('username',req.body.username).send('cookie set');
        res.cookie('password', req.body.password).send('cookie set');
        return res.json({status:"OK"});
      }
      else{
        return res.json({status: "ERROR"});
      }
    }
  }
  else{
    return res.json({status: "ERROR"});
  }
})
app.post('/logout', async(req,res)=>{
  res.clearCookie('username');
  res.clearCookie('password');
})

app.post('/ttt/play', async(req,res)=>{
  let username = req.cookies.username;
  let password = req.cookies.password;

  if(username === null || password === null){
    res.json({status : "ERROR"});
  }
  
  let user = User.findOne({username: username});

  //everything with a value is false

  let index = req.body.move;

  int n = users.games.length;
  if(n==0){
    let obj = {
      grid: ["","","","","","","","",""],
      winner: "",
      createdAt: new Date()
    }
    user.games.push(obj);
  }
  let grid = user.games[n-1].board.grid;

  if(index === null){
    res.json({
      status: "OK",
      grid: grid,
      winner: user.games[n-1].board.winner
    });
  }

  let winner = "";
  //if undefined(no value) then it is open space, else error
  if(!grid[index]){
    grid[index]='X';

    if(grid[0]==grid[1] && grid[1]==grid[2])
      winner = grid[0];
    if(grid[3]==grid[4] && grid[4]==grid[5])
      winner = grid[3];
    if(grid[6]==grid[7] && grid[7]==grid[8])
      winner = grid[6];
    if(grid[0]==grid[3] && grid[3]==grid[5])
      winner = grid[0];
    if(grid[1]==grid[4] && grid[4]==grid[7])
      winner = grid[1];
    if(grid[2]==grid[5] && grid[5]==grid[8])
      winner = grid[2];
    if(grid[0]==grid[4] && grid[4]==grid[8])
      winner = grid[0];
    if(grid[2]==grid[4] && grid[4]==grid[6])
      winner = grid[2];
    
    if(winner!=""){
      user.games[n-1].board.winner = winner;
      await user.save();

      let obj = {
        grid: ["","","","","","","","",""],
        winner: "",
        createdAt: new Date()
      }
      user.games.push(obj);
    } 
    else{
      for(let i = 0; i<9; i++){
        if(grid!=""){
          grid[i]='O';
          await user.save();
          break;
        }
      }
    } 
    res.json({
      status: "OK",
      grid: grid,
      winner: winner
  }
  else{
    res.json({status: "ERROR"});
  }
})


//THESE ARE STATS!

app.post('/listgames', async (req,res)=>{
  let username = req.cookies.username;

  let user = await User.findOne({username: username});

  if(user===null){
    res.json({status: "ERROR"});
  }

  let boards = [];

  for(let i = 0; i<user.games.length;i++){
    let temp = {i: user.games.board.createdAt};
    boards.push(temp);
  }

  let response = {
    status: "OK",
    "games": boards
  };

  res.json(response);

  
})

app.post('/getgame', async(req,res) => {
  let username = req.cookies.username;
  
  let user = await User.findOne({username: username});

  if(user===null){
    res.json({status: "ERROR"});
  }

  let id = req.body.id;
  
  if(id>User.games.length){
    res.json({status: "ERROR"});
  }
  else{
    let response = {
      status: "OK",
      grid: User.games.grid[id],
      winner: User.games.winner
    }

    res.json(response);
  }


})
app.post('getscore', async(req,res)=>{
  let username = req.cookies.username;
  
  let user = await User.findOne({username: username});

  if(user===null){
    res.json({status: "ERROR"});
  }
  let human = 0;
  let wopr = 0;
  let ties = 0;
  
  for(let i = 0; i<User.games.length; i++){
    if(User.games[i].winner == 'X'){
      human++;
    }
    else if(User.games[i].winner == 'O'){
      wopr++;
    }
    else if(User.games[i].winner == 'T'){
      ties++;
    }
  }

  let response = {
    status: 'OK',
    human: human,
    wopr: wopr,
    ties: ties
  };

  res.json(reponse);

})


app.listen(port, () => {
  console.log(`App listening on ${port}`)
})