require('dotenv').config()
const {Shop,User, Item,Category,MainCategory,Cart}=require('../models/index')
const jwt=require('jsonwebtoken')



const checkUser=async(req,res,next)=>{
    try{
        const token = req.cookies['jwt']
        const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const user=await User.findOne({where:{id:decoded.sub},include:[{model:Cart}]})
        if(!user){
            next()
        }else{
            req.user=user
            next()
        }      
    }catch(err){
        next() 
    }
}

const isAuth=async(req,res,next)=>{
    if(!req.user){
        return res.status(401).redirect('/login')
    }else{
        next()
    }
}

const isAdmin=async(req,res,next)=>{
    if(!req.user || req.user.role!=='admin'){
        res.redirect('/admin/login')
    }else{
        next()
    }
}

const isShopOwner=async(req,res,next)=>{
    let shop=await Shop.findByPk(req.params.id)
    if(!shop){
        return res.json({success:false,message:'không thể tìm thấy shop'})
    }
    if(shop.userId!==req.user.id){
        return res.json({success:false,message:'không có quyền truy cập'})
    }
    req.shop=shop
    next()
}
const notHaveShop=async(req,res,next)=>{
    let shop=await Shop.findOne({where:{userId:req.user.id}})
    if(!shop){
        next()
    }else{
        res.redirect('/shop/my-shop/homepage')
    }
}
const myShop=async(req,res,next)=>{
    try{
        let shop=await Shop.findOne({where:{userId:req.user.id},include:[{model:User}]})
        if (!shop){
            res.redirect('/shop/add-shop')
        }
        else{
            req.shop=shop
            next()
        }
    }catch(error){
        console.log(error)
    }
}
const checkShopHasItem=async(req,res,next)=>{
    try{
        let item=await Item.findOne({where:{id:req.params.itemId},include:[{model:Category,include:[{model:MainCategory}]}]})
        if(!item){
            return res.redirect('/item')
        }
        if(item.shopId!==req.shop.id){
            return res.redirect('/shop/my-shop/items')
        }
        req.item=item
        next()
    }catch(error){
        console.log(error)
    }
}
const moveToAdminHP=(req,res,next)=>{
    if(req.user && req.user.role==='admin'){
        res.redirect('/admin/homepage')
    }else{
        next()
    }
}


module.exports={checkUser,isAuth,isShopOwner,myShop,checkShopHasItem,isAdmin,notHaveShop,moveToAdminHP}
