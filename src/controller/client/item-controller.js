const{Item,Shop, Voucher, Evaluate, User, Category,MainCategory}=require('../../models/index')
const {upload}=require('../utils/add_file')
const moment=require('moment')
const fs=require('fs')
const path=require('path')

const uploadItemImage=upload.array('items')

const getAddItem=async(req,res)=>{
    try{
        const mainCategories=await MainCategory.findAll()
       
        res.render('item/add-item',{shop:req.shop,mainCategories})
    }catch(error){
        console.log(error)
    }
}

const addItem=async(req,res)=>{
    try{console.log(req.body)
        console.log(req.files)
        let {name,description,material,originalPrice,discount,stock,pickUpTime,flashSale,flashSaleTime,categoryId}=req.body
        if(!flashSaleTime){
            flashSale={}
        }
        let sold=0
        let shopId=req.shop.id
        let isExist=await Item.findOne({where:{name}})
        if(isExist){
            return res.json({success:false,error:'name is exist'})
        }    
        let images=req.files.map((image)=>`/uploads/items/${image.filename}`)
        let item=await Item.create({name,shopId,description,originalPrice,discount,images,stock,sold,flashSale,material,flashSaleTime,pickUpTime,categoryId})
        res.status(201).json({success:true,message:'đã tạo thành công'})
    }catch(error){
        res.status(500).json({success:false,message:'lỗi server'})
        console.log(error)
    }
}

const getAllItems=async(req,res)=>{
    try{
        let items=await Item.findAll()
        res.status(200).json({items})
    }catch(error){
        console.log(error)
    }
}

const getItemById=async(req,res)=>{
    try{
        let id=req.params.id
        let item=await Item.findOne({where:{id},include:[{model:Evaluate,include:[{model:User}]},{model:Category,include:MainCategory},{model:Shop},{model:Voucher}]})
        if(!item){
            return res.json({error:'item isn\'t exist'})
        }
        item.avgRating=(item.Evaluates.reduce((total,current)=>total+Number(current.rating),0)/(item.Evaluates.length)).toFixed(1)
        let voucher
        if(req.user){
            voucher=await Voucher.findOne({where:{userId:req.user.id,itemId:id}})
        }
        item.voucher=voucher?voucher.percent:0
        Item.calculatePrice(item)
        res.render('client/item/item',{item,voucher})
    }catch(error){
        console.log(error)
    }
}
const editItem=async(req,res)=>{
    try{
        let images=req.item.images
        if(req.files.length){
            req.files.forEach((image)=>{images.push(`/uploads/items/${image.filename}`)})
        }
        req.body.images=images
        const keys=Object.keys(req.body)
        for (let key of keys ){
            req.item[key]=req.body[key]
            await req.item.save({fields:[`${key}`]})
        }
        res.status(200).json({success:true,message:'update success'})
    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}
const getEditItem=(req,res)=>{
    console.log(req.item.images)
    res.render('./item/edit-item',{item:req.item})
}
const deleteItem=async(req,res)=>{
    try{
        req.item.images.forEach((image)=>{
            fs.unlink(path.join(__dirname,`../public${image}`),(error)=>{
                if(error){
                    console.log(error)
                }else{
                    console.log('deleted')
                }
            })
        })
        await req.item.destroy()
        res.status(200).json({success:true,message:'delete complete'})
    }catch(error){
        res.status(500).json({success:false,message:error.message})
    }
}

const deleteImage=async(req,res)=>{
    try{
        const deleteImage=req.body.image
        let images=req.item.images
        await fs.unlink(path.join(__dirname,`../public${deleteImage}`),(error)=>{
            if(error){
                console.log(error)
            }
        })
        let newImages=images.filter((image)=>image!==deleteImage)
        await req.item.update({images:newImages})
        res.json({success:true,message:'deleted'})
    }catch(error){
        res.json({success:false,message:`${error.message}`})
    }
}


const getItemByCategory=async(req,res)=>{
    console.log(1)
    const categoryId=req.params.categoryId
    const category=await Category.findByPk(categoryId)
    const items=await Item.findAll({where:{categoryId}})
    res.render('client/item/category_item',{items,category})
}


module.exports={getItemByCategory,addItem,getAllItems,getItemById,editItem,deleteItem,uploadItemImage,getEditItem,getAddItem,deleteImage}