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
}).single("images");


uploadImage = (req,res) => {
    console.log("hey");
    upload(req, res, (err) => {
        if(err){
            console.log(err);
            res.status(200).json({error: true, message: "failed to upload"});
        }
        else{
            let ext = path.extname(req.file.filename);
            if(ext!='.png' && ext!='.jpeg'){
                res.status(200).json({error: true, message: "wrong file type"});
            }
            else
                res.status(200).json({mediaid: req.file.filename });
        }
    })
    
}

access = (req,res) => {
    let id = req.params.mediaid;
    var path = {
        root: path.join(__dirname,'../uploads')
    }
    res.sendFile('${mediaid}', path);
    
}


module.exports ={
    uploadImage,
    access
}