const {MainCategory}=require('../../models/index')
const {upload}=require('../utils/add_file')
const uploadMainCategoryLogo=upload.single('mainCategory')
const path=require('path')
const fs=require('fs')
const getAllMainCategories=async (req,res)=>{
    try{
        const mainCategories=await MainCategory.findAll()
        res.render('admin/main_category/main-categories',{mainCategories})
    }catch(error){
        console.log(error)
    }
}
const changeMainCategoryLogo=async(req,res)=>{
    try{
        const mainCategory=await MainCategory.findByPk(req.params.id)
        const logo=`/uploads/mainCategory/${req.file.filename}`
        if(!mainCategory){
            return res.json({success:false,message:'không tìm thấy danh mục chính này'})
        }
        fs.unlink(path.join(__dirname,`../../public${mainCategory.logo}`),(error)=>{
            if(error){
                return res.json({success:false,message:error.message})
            }else{
                console.log('deleted')
            }
        })
        mainCategory.logo=logo
        await mainCategory.save({fields:['logo']})
        res.json({success:true,message:'cập nhật logo thành công'})
    }catch(error){
        res.json({success:false,message:error.message})
    }
}
const getAddMainCategory=(req,res)=>{
    res.render('admin/main_category/add-main-category',{message:''})
}
const addMainCategory=async(req,res)=>{
    try{
        const logo=`/uploads/mainCategory/${req.file.filename}`
        const name=req.body.name
        const isExist=await MainCategory.findOne({where:{name}})
        if(isExist){
            res.render('admin/main_category/add-main-category',{message:'tên đã tồn tại'})
        }
        await MainCategory.create({name,logo})
        res.redirect('/admin/main-categories')
    }catch(error){
        console.log(error)
    }
}

const deleteMainCategory=async(req,res)=>{
    try{
        const mainCategory=await MainCategory.findByPk(req.params.id)
        if(!mainCategory){
            return res.json({success:false,message:'không tìm thấy danh mục này'})
        }
        await mainCategory.destroy()
        res.json({success:true,message:'đã xóa'})
    }catch(error){
        console.log(error)
    }
}

module.exports={getAllMainCategories,changeMainCategoryLogo,uploadMainCategoryLogo,getAddMainCategory,addMainCategory,deleteMainCategory}