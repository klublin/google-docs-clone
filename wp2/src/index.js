const mail = require('nodemailer');
const uuid = require('uuid');
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
        let verify = uuid.v4();
        const newUser = await User.create({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            key: verify,
            verified: false,
            games: []
        });
        let link ='http://thebadbeginning.cse356.compas.cs.stonybrook.edu/verify?email=' + encodeURIComponent(req.body.email) + '&key=' + encodeURIComponent(verify); 
        transporter.sendMail({
          to: req.body.email,
          from: 'Kevin <root@thebadbeginning.cse356.compas.cs.stonybrook.edu>',
          subject: 'Verification email',
          text: link
        });
        
        res.json({status: "OK"});
    }
})

app.get('/verify', async(req,res) => {
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
  if(checkValidUser!==null){
    if(checkValidUser.password!==req.body.password){
      res.json({status: "ERROR"});
    }
    else{
      if(checkValidUser.verified){
        res.cookie('username', req.body.username);
        res.cookie('password', req.body.password);
        res.json({status:"OK"});
      }
      else{
        res.json({status: "ERROR"});
      }
    }
  }
  else{
    res.json({status: "ERROR"});
  }
})
app.post('/logout', async(req,res)=>{
  res.clearCookie('username');
  res.clearCookie('password');

  res.json({status: "OK"});
})

function checkWinner(grid){
  let winner = " ";
  if(grid[0]==grid[1] && grid[1]==grid[2])
    winner = grid[0];
  else if(grid[3]==grid[4] && grid[4]==grid[5])
    winner = grid[3];
  else if(grid[6]==grid[7] && grid[7]==grid[8])
    winner = grid[6];
  else if(grid[0]==grid[3] && grid[3]==grid[6])
    winner = grid[0];
  else if(grid[1]==grid[4] && grid[4]==grid[7])
    winner = grid[1];
  else if(grid[2]==grid[5] && grid[5]==grid[8])
    winner = grid[2];
  else if(grid[0]==grid[4] && grid[4]==grid[8])
    winner = grid[0];
  else if(grid[2]==grid[4] && grid[4]==grid[6])
    winner = grid[2];
  
  return winner;
}
app.post('/ttt/play', async(req,res)=>{
  console.log(req.body);
  let username = req.cookies.username;
  let password = req.cookies.password;
  if(!username || !password){
    console.log("bye");
    res.json({status : "ERROR"});
    return;
  }
  
  let user = await User.findOne({username: username});


  let index = req.body.move;
  if(user.games.length==0){
    let obj={
      grid: [" "," "," "," "," "," "," "," "," "],
      winner: " ",
      createdAt: new Date()
    }
    user.games.push(obj);
    await user.save();
  }
  let n = user.games.length;

  if(user.games[n-1].winner!=" "){
    let obj={
      grid: [" "," "," "," "," "," "," "," "," "],
      winner: " ",
      createdAt: new Date()
    }
    user.games.push(obj);
    await user.save();
  }


  let grid = user.games[n-1].grid;

  if(index === null){
    res.json({
      status: "OK",
      grid: grid,
      winner: user.games[n-1].winner
    });
    return;
  }

  let winner = " ";

  if(grid[index]==" "){
    grid[index]='X';
    await user.save();

    winner = checkWinner(grid);
    if(winner!=" "){
      user.games[n-1].winner = 'X';
      await user.save();

      res.json({
        status: "OK",
        grid: grid,
        winner: winner
      });
      return;
    };
    
    
    for(let i = 0; i<9; i++){
      if(grid[i]==" "){
        grid[i]='O';
        await user.save();
        break;
      }
    }
    winner = checkWinner(grid);
    if(winner!=" "){
      user.games[n-1].winner = 'O';
      await user.save();

      res.json({
        status: "OK",
        grid: grid,
        winner: winner
      });
      return;
    }

    for(let i = 0; i<9;i++){
      if(grid[i]==' ')
        break;
      if(i==8 && grid[i]!=' '){
        winner = 'T';
        user.games[n-1].winner = 'T';
        await user.save();
      }
    } 
    
    console.log(grid.toString());  
    res.json({
      status: "OK",
      grid: grid,
      winner: winner
    })
  }
  else{
    res.json({
      status: "ERROR",
      grid: grid,
      winner: winner
    });
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
    let temp = {i : user.games.createdAt};
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


  console.log(user);

  if(user===null){
    res.json({status: "ERROR"});
  }

  let id = req.body.id;
  console.log(req.body);
  
  if(id>user.games.length){
    res.json({status: "ERROR"});
  }
  else{
    let n = user.games.length;
    console.log(user.games);
    let response = {
      status: "OK",
      grid: user.games[n-1].grid,
      winner: user.games.winner
    }

    res.json(response);
  }


})
app.post('/getscore', async(req,res)=>{
  let username = req.cookies.username;
  
  let user = await User.findOne({username: username});

  if(user===null){
    res.json({status: "ERROR"});
  }
  let human = 0;
  let wopr = 0;
  let ties = 0;
  
  for(let i = 0; i<user.games.length; i++){
    if(user.games[i].winner == 'X'){
      human++;
    }
    else if(user.games[i].winner == 'O'){
      wopr++;
    }
    else if(user.games[i].winner == 'T'){
      ties++;
    }
  }

  let response = {
    status: 'OK',
    human: human,
    wopr: wopr,
    tie: ties
  };
  console.log(response);
  res.json(response);

})


app.listen(port, () => {
  console.log(`App listening on ${port}`)
})