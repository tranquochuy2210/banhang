
const {Category,MainCategory}=require('../../models/index')
const {upload}=require('../utils/add_file')
const fs=require('fs')
const path=require('path')

const uploadCategoryLogo=upload.single('category')
const addCategory=async(req,res)=>{
    try{
        const mainCategoryId=req.params.mainCateId
        const mainCategory=await MainCategory.findByPk(mainCategoryId)
        const logo=req.file?`/uploads/category/${req.file.filename}`:''
        const name=req.body.name
        const isExist=await MainCategory.findOne({where:{name}})
        if(isExist){
            res.render('admin/main_category/add-main-category',{message:'tên đã tồn tại',mainCategory})
        }
        await Category.create({name,logo,mainCategoryId})
        res.redirect(`/admin/categories/${mainCategoryId}`)
    }catch(error){
        console.log(error)
    }
}

const getCategoryByMainCate=async(req,res)=>{
    try{
        const mainCategoryId=req.params.mainCateId
        const mainCategory=await MainCategory.findOne({where:{id:mainCategoryId}})
        const categories=await Category.findAll({where:{mainCategoryId}})
        res.render('admin/category/categories',{categories,mainCategory})
    }catch(error){
        console.log(error)
    }
}

const changeCategoryLogo=async(req,res)=>{
    try{
        const category=await Category.findByPk(req.params.id)
        const logo=`/uploads/category/${req.file.filename}`
        if(!category){
            return res.json({success:false,message:'không tìm thấy danh mục này'})
        }
        await fs.unlink(path.join(__dirname,`../../public${category.logo}`),(error)=>{
            if(error){
                return res.json({success:false,message:error.message})
            }else{
                console.log('deleted')
            }
        })
        category.logo=logo
        await category.save({fields:['logo']})
        res.json({success:true,message:'cập nhật logo thành công'})
    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}
const getAddCategory=async (req,res)=>{
    try{
        const mainCateId=req.params.mainCateId
        const mainCategory=await MainCategory.findByPk(mainCateId)
        res.render('admin/category/add-category',{message:'',mainCategory})
    }catch(error){
        console.log(error)
    }
}


const deleteCategory=async(req,res)=>{
    try{
        const category=await Category.findByPk(req.params.id)
        if(!category){
            return res.json({success:false,message:'không tìm thấy danh mục này'})
        }
        await category.destroy()
        res.json({success:true,message:'đã xóa'})
    }catch(error){
        console.log(error)
    }
}


module.exports={addCategory,deleteCategory,getCategoryByMainCate,changeCategoryLogo,getAddCategory,uploadCategoryLogo}
