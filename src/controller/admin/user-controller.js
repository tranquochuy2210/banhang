const {User}=require('../../models/index')
const getAllUsers=async(req,res)=>{
    try{
        const users=await User.findAll()
        res.render('admin/user/users',{users})
    }catch(error){
        console.log(error)
    }   
}
const changeRole=async (req,res)=>{
    try{
        const id=req.params.userId
        const user=await User.findByPk(id)
        if(!user){
            return res.json({success:false,message:'tài khoản không tồn tại'})
        }
        if(user.role==='admin'){
            user.role='user'
        }else{
            user.role='admin'
        }
        await user.save({fields:['role']})
        res.json({success:true,message:'thay đổi quyền thành công'})
    }catch(error){
        res.json({success:false,message:error.message})
    }
    
}
const deleteAccount=async (req,res)=>{
    try{
        const id=req.params.userId
        const user=await User.findByPk(id)
        if(!user){
            return res.json({success:false,message:'tài khoản không tồn tại'})
        }
        await user.destroy()
        res.json({success:true,message:'đã xóa tài khoản thành công'})
    }catch(error){
        console.log(error)
    }
    
}
const getUser=async(req,res)=>{
    try{
        const id=req.params.userId
        const user=await User.findByPk(id)
        if(!user){
            return res.json({success:false,message:'tài khoản không tồn tại'})
        }
        res.render('admin/user/user-profile',{user})
    }catch(error){
        res.json({success:false,message:error.message})
    }
}

module.exports={getAllUsers,changeRole,deleteAccount,getUser}