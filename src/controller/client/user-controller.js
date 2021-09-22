const {User,Order,ShippingCompany,OrderItem,Item,Voucher,Cart}=require('../../models/index')
const {isAuth}=require('../../middleware/auth')
const {upload}=require('../utils/add_file')

const bcrypt=require('bcrypt')
const fs=require('fs')
const path=require('path')
const uploadAvatar=upload.single('avatar')

const getUserInfo=(req,res)=>{
    const {lastName, email, password, firstName, phone, gender, birthDate, address, avatar}=req.user
    res.render('user/personal',{lastName, email, password, firstName, phone, gender, birthDate, address, avatar})
}
const editUser=async(req,res)=>{
    try{
        console.log(req.user)
        let {firstName,lastName,phone,gender,birthDate,address}=req.body
        console.log({firstName,lastName,phone,gender,birthDate,address})
        await req.user.update({firstName,lastName,phone,gender,birthDate,address})
        res.status(200).json({success:true,message:'cập nhật thông tin thành công'})
    }catch(error){
        res.status(500).json({success:false,message:error.message})
        console.log(error)
    }
}
const deleteUser=async(req,res)=>{
    try{
        let id=req.params.id
        let user=await User.findByPk(id)
        if(!user){
            return res.status(404).json({error:'can\'t find user'})
        }
        await user.destroy()
        res.status(200).json({message:'delete complete'})
    }catch(error){
        console.log(error)
    }
}
const updateAvatar=async(req,res)=>{
    try{
        let avatar=`/uploads/avatar/${req.file.filename}`
        if (req.user.avatar !== '/uploads/avatar/nam.jpg' || req.user.avatar !=='/uploads/avatar/nu.jpg') {
            fs.unlink(path.join(__dirname,`../../public${req.user.avatar}`),(error)=>{
                if(error){
                    return res.status(500).json({success:false})
                }
            })
        }
        await req.user.update({avatar})
        res.json({success:true,avatar})
    }catch(error){
        console.log(error)
    }
    
}
const getChangePassword=(req,res)=>{
    res.render('user/change_password')
}
const changePassword=async(req,res)=>{
    try{
        const {newPassword, oldPassword}=req.body
        let isMatch=await bcrypt.compare(oldPassword,req.user.password)
        if(!isMatch){
            res.json({success:false,message:'Mật khẩu không chính xác'})
        }
        let hashPassword=await bcrypt.hash(newPassword,10)
        await req.user.update({password:hashPassword})
        res.json({success:true,message:'đổi password thành công'})
    }catch(error){
        console.log(error)
    }
}
const getOrder=async(req,res)=>{
    const userId=req.user.id
    const orders=await Order.findAll({
        where:{userId},
        include:[{
            model:ShippingCompany,attributes:['name']
        },{
            model:OrderItem,include:[{model:Item}]
        }
        ]})
    const preparingOrders=orders.filter((order)=>order.status==='preparing')
    const completedOrders=orders.filter((order)=>order.status==='completed')
    const transportingOrders=orders.filter((order)=>order.status==='transporting')
    const deletedOrders=orders.filter((order)=>order.status==='deleted')
    res.render('user/my_order',{orders,preparingOrders,completedOrders,transportingOrders,deletedOrders})
}
const getOrderByUser=async(req,res)=>{
    try{
        let status=req.query.status==='all'?'':req.query.status
        const userId=req.user.id
        let orders
        if(status){
            orders=await Order.findAll({
                where:{userId,status},
                include:[{
                    model:ShippingCompany,attributes:['name']
                },{
                    model:OrderItem,include:[{model:Item}]
                }
                ]})
        }else{
            orders=await Order.findAll({
                where:{userId},
                include:[{
                    model:ShippingCompany,attributes:['name']
                },{
                    model:OrderItem,include:[{model:Item}]
                }
                ]})
        }

        res.json({orders})
    }catch(error){
        console.log(error)
    }
}
const getUser=(req,res)=>{
    return res.json({user:req.user})
}


const getVoucherByUser=async(req,res)=>{
    try{
        const userId=req.user.id
        let vouchers=await Voucher.findAll({where:{userId},include:[{model:Item}]})
        console.log(vouchers)
        return res.render('user/voucher',{vouchers})
    }catch(error){
        res.json({success:false,message:'lỗi server'})
    }
}
const getMyCart=async(req,res)=>{
    try{
        const userId=req.user.id
        const carts=await Cart.findAll({where:{userId},include:[{model:Item}]})
        for(let cart of carts){
            const voucher=await Voucher.findOne({where:{userId,itemId:cart.Item.id}})
            cart.Item.voucher=voucher?voucher.percent:0
            Item.calculatePrice(cart.Item)
        }
        const shippings=await ShippingCompany.findAll()
        res.render('user/my-cart',{carts,user:req.user,shippings})
    }catch(error){
        console.log(error)
    }
}





module.exports={getUser,uploadAvatar,getUserInfo,editUser,deleteUser,updateAvatar,getChangePassword,getChangePassword,changePassword,getOrder,getOrderByUser,getVoucherByUser,getMyCart}

