const nodeMailer = require('nodemailer');
const uuid = require('uuid')
const bodyParser = require('body-parser')
const User = require('../models/Users')
const sessions = require('express-session');


signup = async (req,res) => {
    const emailCheck = await User.findOne({email: req.body.email});

    if(!emailCheck){
        res.status(200).json({error: true, message: 'Duplicate email'});
        return;
    }
    
    let verify = new uuid.v4();
    const newUser = await User.create({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        key: verify,
        verified: false
    })

    let link ="" ;
    transporter.sendMail({
        to: req.body.email,
        from: "",
        subject: 'Verification email',
        text: link
    });

    res.status(200).json({});
}

login = async (req, res) => {
    let verify = await User.findOne({key: req.body.email});
    if(!verify || verify.password!= req.body.email || !verify.verified){
        res.status(200).json({error: true, message: "incorrect credentials"});
        return;
    }

    let session = req.session;
    session.email = req.body.email;

    res.status(200).json({name: verify.name});
}

logout = (req, res) => {
    req.session.destroy();
    
    res.status(200).json({});
}

verify = async (req, res) => {
    let checkDB = await User.findOne({key: req.query.key});
    if(!checkDB){
      res.status.json({error: true, message: "cannot find the user"});
    }
    else{
      checkDB.verified = true;
      await checkDB.save().catch((err) => {
        console.log(err);
      });
      res.status(200).json({});
    }
}


module.exports ={
    signup, 
    login, 
    logout,
    verify
}