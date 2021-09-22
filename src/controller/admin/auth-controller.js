const {User, MainCategory, Item}=require('../../models/index')
const {isAdmin}=require('../../middleware/auth')
const bcrypt=require('bcrypt')
const {generateAccessToken}=require('../auth')

const getAdminLogin=(req,res)=>{
    res.render('admin/login')
}
const adminLogin=async(req,res)=>{
    try{
        const email=req.body.email
        const password=req.body.password
        console.log(email,password)
        const user=await User.findOne({where:{email}})
        if(!user){
            return res.json({success:false,message:'không tìm thấy user'})
        }
        console.log(user.password)
        const isMatch=await bcrypt.compare(password,user.password)
        console.log(isMatch)
        if(!isMatch){
            return res.json({success:false,message:'mật khẩu không khớp'})
        }
        if(user.role!=='admin'){
            return res.json({success:false,message:'không có quyền truy cập trang này'})
        }
        const accessToken= generateAccessToken(user)
        return res.cookie('jwt',accessToken).json({success:true})
    }catch(error){
        console.log(error)
    }
   
}
const getHomepage=(req,res)=>{
    res.render('admin/homepage')
}
module.exports={getAdminLogin,adminLogin,getHomepage}