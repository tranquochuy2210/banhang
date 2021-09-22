
var multer  = require('multer');

const path=require('path')


const storage=multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,path.join(__dirname,`../../public/uploads/${file.fieldname}`))
  },

  filename:(req,file,cb)=>{
      cb(null,`${Date.now()}.jpg`)
  },
  
})
const upload=multer({storage,limits: {
  fileSize: 10000000
  },
  fileFilter(req, file, cb) {
    if(!file){return cb(null,false)}
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
    console.log('file is not right')
      return cb(null,false)
  }
  cb(undefined, true)
}})
  module.exports={upload}