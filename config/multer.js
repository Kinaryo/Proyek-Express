const multer = require('multer')
const path = require('path')
const ErrorHandler = require('../utils/ErrorHandler')

const storage = multer.diskStorage({
    destination: function(req,res,cb){
        cb(null,'public/images/')
    },

    filename: function (req, res,cb ){
        const uniqueSuffix = Date.now() + '-' +Math.round(Math.random() * 1E9)
        cb(null,file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})


const uploud = multer({
    storage,

    fileFilter: function (req,file,cb){
        if(file.mimetype.startsWith('images/')){
            cb(null,true)
        }else{
            cb(new ErrorHandler('Only images are allowed',405))
        }
    }
})