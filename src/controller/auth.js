const {User, MainCategory, Item}=require('../models/index')
const bcrypt=require('bcrypt')
const jwt =require ('jsonwebtoken')
const {upload}=require('./utils/add_file')

const Banner = require('../models/Banner')


const uploadAvatar=upload.single('avatar')

const getHomepage=async(req,res)=>{
    try{
        const mainCategories=await MainCategory.findAll()
        const allItem=await Item.findAll()
        allItem.forEach((item)=>{
            Item.countDown(item)
            Item.isFlashSale(item)
            Item.calculatePrice(item)
        })
        const onSaleItems=allItem.filter((item)=>item.onSale)
        const flashSaleItem=allItem.filter((item)=>item.countDown)
        const randomIndex=[]
        const randomItem=[]
        //select random 6 item
        for(let x=0;x<6;x++){
            let index=Math.floor((Math.random())*(allItem.length))
            if(allItem.length<6){
                allItem.forEach((item)=>{
                    randomItem.push(item)
                })
                break
            }else{
                while (randomIndex.includes(index)){
                    index=(index+1)%(allItem.length)
                }
                randomIndex.push(index)
            }
            
        }
        randomIndex.forEach((index)=>{
            const item=allItem[index]
            randomItem.push(item)
            
        })  
        const banners=await Banner.findAll({where:{status:true}})
        res.render('homepage',{mainCategories,randomItem,flashSaleItem,onSaleItems,banners})
    }catch(error){
        console.log(error)
    }
}
const generateAccessToken=(user)=>{
    const payload={
        sub:user.id,
        iat:Date.now()
    }
    const accessToken=jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET)
    return accessToken
}

const getLogin=async(req,res)=>{
    res.render('login')
}
const getRegister=async(req,res)=>{
    try{
        res.render('register')
    }catch(error){
        console.log(error)
    }
}

const login=async(req,res)=>{
    try{ 
        const {email,password}=req.body
        if(!email || !password){
            return res.json({success:false,message:'email and password must be provided'})
        }
        let user=await User.findOne({where:{email}})
        if(!user){
            return res.json({success:false,message:'email or password is wrong'})
        }
        const isMatch=await bcrypt.compare(password,user.password)
       
        if(!isMatch){
            return res.json({success:false,error:'email or password is wrong'})
        }else{
            const accessToken=generateAccessToken(user)
            return res.cookie('jwt',accessToken).json({success:true})
        }
    }catch(error){
        console.log(error)
        return res.status(500).json({success:false,message:'server error'})
    }
}
const register=async(req,res)=>{
    try{
        let {firstName,lastName,password,phone,email,gender,birthDate,province,district,ward}=req.body
        let isExist=await User.findOne({where:{email}})
        const address=province.split('-')[1] + ', '+ district.split('-')[1] + ', ' +ward.split('-')[1]
        let avatar =req.file? `/uploads/avatar/${req.file.filename}` : null
        if(!avatar) {
            avatar = gender==='male'?'/uploads/avatar/nam.jpg' :'/uploads/avatar/nu.jpg'
        }
        if(isExist){
            return res.json({error:'email is exist'})
        }
        let hashPassword=await bcrypt.hash(password,10)
        let user=await User.create({firstName,lastName,email,password:hashPassword,phone,gender,email,birthDate,avatar,address})
        const accessToken=generateAccessToken(user)
        res.cookie('jwt',accessToken)
        res.redirect('/')
    }catch(error){
        console.log(error)
    }
}
const logOut=(req,res)=>{
    res.cookie('jwt','')
    res.redirect('/login')
}
const getUser=(req,res)=>{
    res.json({user:req.user})
}
module.exports={getHomepage,login,getLogin,logOut,register,getRegister,uploadAvatar,getUser,generateAccessToken}