const{Shop, User, Item, Order, RatingItem, Follow,Evaluate}=require('../../models/index')
const db=require('../../config/db')
const {upload}=require('../utils/add_file')
const { Sequelize } = require('../../config/db')
const fs=require('fs')

const uploadShopImage=upload.single('shop')
const getAddShop=async(req,res)=>{
    res.render('my_shop/add-shop')
}

const addShop=async(req,res)=>{
    try{
       
        const userId=req.user.id
        const {name,address}=req.body
        const isExist=await Shop.findOne({where:{name}})
        if(isExist){
            return res.json({success:false,message:'tên đã tồn tại'})
        }
        const image=req.file?`/uploads/shop/${req.file.filename}`:null
        const shop=await Shop.create({name,userId,address,image})
        res.json({success:true,message:'tạo thành công'})
    }catch(error){
        res.json({success:false,message:error.message})
    }
}
const getAllShop=async(req,res)=>{
    try{
        let shops=await Shop.findAll()
        res.status(200).json({shops})
    }catch(error){
        console.log(error)
    }
}
const getShop=async(req,res)=>{
    try{
        const id=req.params.shopId
        let shop =await Shop.findOne({
            where:{id},
            include:[{model:User},{model:Item,include:[{model:Evaluate}]},{model:Follow}],
        })
        
        if(!req.user){
            shop.followed=false
        }else{
            const followed=await Follow.findOne({where:{shopId:id,userId:req.user.id}})
            if(!followed){
                shop.followed=false
            }else{
                shop.followed=true
            }
        }
        Shop.rating(shop)
        const follows=await Follow.findAll({where:{shopId:id},attributes:[[Sequelize.fn('COUNT','userId'),'followCount']]})
        shop.followCount=follows[0].dataValues.followCount
        res.render('client/shop/shop',{shop})
    }catch(error){
        console.log(error)
    }
}
const editShop=async(req,res)=>{
    try{
        const {name,address,reOpenOn}=req.body
        const status=req.body.status?true:false
        if(req.file){
            console.log(1)
            fs.unlink(req.shop.image, (err) => {
                if (err) {
                    console.log('cannot find')
                };
                console.log('image was deleted');
              })
        }
        const image=req.file?`/uploads/shop/${req.file.filename}`:req.shop.image
        await req.shop.update({name,address,status,reOpenOn,image})
        res.status(200).json({success:true,message:'cập nhật thành công'})
    }catch(error){
        console.log(error)
    }
}
const deleteShop=async(req,res)=>{
    try{
        let id=req.params.id
        let shop=await Shop.findByPk(id)
        if(!shop){
            return res.json({error:'unable to find shop'})
        }
        await shop.destroy()
        res.json({msg:'Shop has been deleted'})
    }catch(error){
        console.log(error)
    }
}


const getHomepage=async(req,res)=>{
    let shop =await Shop.findOne({where:{id:req.params.id},include:[{model:User}]})
    if(!shop){
        return res.render('error',{error:'cannot find shop'})
    }
}


const getRating=async(req,res)=>{
    try{
        const [result,metadata]=await db.query(
            `select c.lastName,a.comment,a.rating,DATE_FORMAT(a.createdAt, "%M %e %Y") as createdAt,b.name as ItemName from evaluates as a
            inner join items as b on b.id=a.itemId
            inner join users as c on a.userId=c.id
            where b.shopId=${req.shop.id}`)
            let rating ={}
            result.forEach((evaluate)=>{
                if(rating[evaluate.rating]){
                    rating[evaluate.rating]+=1
                }else{
                    rating[evaluate.rating]=1
                }
            })
            let sum=Object.keys(rating).reduce((total,current)=>total+Number(current)*rating[current],0)
            let count=Object.keys(rating).reduce((total,current)=>total+Number(rating[current]),0)
            let average=Math.floor(sum/count*10)/10
            res.render('shop/rating',{average,rating,ratingItems:result})
    }catch(error){
        console.log(error)
    }
    
}



module.exports={getAddShop,addShop,getAllShop,getShop,editShop,deleteShop,getHomepage,getRating}