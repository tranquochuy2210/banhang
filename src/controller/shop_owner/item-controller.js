const{Item,Shop, Voucher, Evaluate, User, Category,MainCategory}=require('../../models/index')
const {upload}=require('../utils/add_file')
const moment=require('moment')
const fs=require('fs')
const path=require('path')

const uploadItemImage=upload.array('items')

const getAddItem=async(req,res)=>{
    try{
        const mainCategories=await MainCategory.findAll()
        res.render('my_shop/item/add-item',{shop:req.shop,mainCategories})
    }catch(error){
        console.log(error)
    }
}

const addItem=async(req,res)=>{
    try{
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

const editItem=async(req,res)=>{
    try{
        const editPart={description,material,originalPrice,discount,stock,pickUpTime,flashSale,flashSaleTime,categoryId}=req.body
        let images=req.item.images
        console.log(editPart)
        if(req.files.length){
            req.files.forEach((image)=>{images.push(`/uploads/items/${image.filename}`)})
        }
        const keys=Object.keys(req.body)
        req.item.image=images
        if(!flashSaleTime){
            flashSale={}
        }
        Object.entries(editPart).forEach(([key,value])=>{
            req.item[key]=value
        })
        await req.item.save()
        res.status(200).json({success:true,message:'update success'})
    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}
const getEditItem=async (req,res)=>{
    const mainCategories=await MainCategory.findAll()
    const categories=await Category.findAll()
    res.render('my_shop/item/edit-item',{item:req.item,mainCategories,categories})
}
const deleteItem=async(req,res)=>{
    try{
        req.item.images.forEach((image)=>{
            fs.unlink(path.join(__dirname,`../../public${image}`),(error)=>{
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
        await fs.unlink(path.join(__dirname,`../../public${deleteImage}`),(error)=>{
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






module.exports={addItem,editItem,deleteItem,uploadItemImage,getEditItem,getAddItem,deleteImage}