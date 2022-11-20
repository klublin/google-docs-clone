const mail = require('nodemailer');
const uuid = require('uuid')
const bodyParser = require('body-parser')
const User = require('../models/Users')
const sessions = require('express-session');

let transporter = mail.createTransport({
	sendmail: true,
	newline: 'unix',
	path: '/usr/sbin/sendmail',
})

signup = async (req,res) => {
    const emailCheck = await User.findOne({email: req.body.email});
    if(emailCheck!==null){
        res.status(200).json({error: true, message: 'Duplicate email'});
        return;
    }
    let verify = uuid.v4();
    const newUser = await User.create({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
        key: verify,
        verified: false
    })
    let link = "http://giveten.cse356.compas.cs.stonybrook.edu/users/verify?email="+encodeURIComponent(req.body.email) + '&key=' + encodeURIComponent(verify);
    transporter.sendMail({
        to: req.body.email,
        from: "root@milestone2",
        subject: 'Verification email',
        text: link
    });

    res.json({status: "OK"});
}

login = async (req, res) => {
    let verify = await User.findOne({email: req.body.email});
    if(!verify || verify.password!= req.body.password|| !verify.verified){
        res.status(200).json({error: true, message: "incorrect credentials"});
        return;
    }
    console.log("SETTING STUFF FOR EXPRESS SESSIONS");
    console.log(req.body);
    let session = req.session;
    session.key = req.body.email;
    session.name = verify.name;
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