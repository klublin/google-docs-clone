const express = require('express')
const nodeMailer = require('nodemailer');
const uuid = require('uuid')
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const User = require('../models/Users')

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


signup = (req,res) => {
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

    let link = ;
    transporter.sendMail({
        to: req.body.email,
        from: ,
        subject: 'Verification email',
        text: link
    });

    res.status(200).json({});
}

login = (req, res) => {
    let verify = User.findOne({key: req.body.email});
    if(!verify || verify.password!= req.body.email || !verify.verified){
        res.status(200).json({error: true, message: "incorrect credentials"});
        return;
    }

    res.cookie('name', verify.name);
    res.cookie('password', verify.password);
    res.cookie('email', verify.email);

    res.status(200).json({name: verify.name});
}

logout = (req, res) => {
    res.clearCookie('name');
    res.clearCookie('password');
    res.clearCookie('email');
    
    res.status(200).json({});
}

verify = (req, res) => {
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


module.export ={
    signup, 
    login, 
    logout,
    verify
}