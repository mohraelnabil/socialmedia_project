const multer = require("multer");
const path = require("path");


const disStorage = multer.diskStorage({
  destination: function (req,file,cb){
    cb(null,'uploads')
  },
  filename: function (req,file,cb){
    const ext=  path.extname(file.originalname)
    const fileName= `${Date.now()}-${file.fieldname}${ext}`
    cb(null,fileName)
  }
})
const memoryStorage = multer.memoryStorage()

const uploadLocal = multer({storage:disStorage})

const uploadCDN = multer({storage:memoryStorage})

module.exports={
    uploadLocal,
    uploadCDN
}