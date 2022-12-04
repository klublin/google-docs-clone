const multer = require('multer');
var path = require('path');

const imageStorage = multer.diskStorage({
    // Destination to store image     
    destination: function(req, file, cb){
        cb(null,'./uploads');
    },
    filename: function(req, file, cb) {
          cb(null, file.originalname);
    }
});
const upload = multer({
    storage: imageStorage
}).single("file");


uploadImage = (req,res) => {
    upload(req, res, (err) => {
        if(err){
            console.log(err);
            res.status(200).json({error: true, message: "failed to upload"});
        }
        else{
            let mime = req.file.mimetype;
            if(ext!='img/png' && ext!='img/gif' && ext!='img/jpeg' && ext!='img/jpg'){
                res.status(200).json({error: true, message: "wrong file type"});
            }
            else
                res.status(200).json({mediaid: req.file.filename });
        }
    })
    
}

access = (req,res) => {
    let id = req.params.mediaid;
    var options = {
        root: path.join(__dirname,'../uploads')
    }
    res.sendFile(`${id}`, options);
    
}


module.exports ={
    uploadImage,
    access
}