const Footer=require('../../models/footer')
const Banner=require('../../models/Banner')
const {upload}=require('../utils/add_file')

const uploadBanner=upload.single('banner')

const getAllFooter=async(req,res)=>{
    try{
        const footers=await Footer.findAll()
        res.render('admin/setting/footer',{footers})
    }catch(error){
        console.log(error)
    }
    
}

const addFooter=async(req,res)=>{
    try{
        const {indexing,title,content}=req.body
        await Footer.create({indexing,title,content})
        res.redirect('/admin/footer')
    }catch(error){
        console.log(error)
    }
}
const editFooter=async(req,res)=>{
    try{
        const {indexing,content,title}=req.body
        const footer=await Footer.findByPk(req.params.footerId)
        await footer.update({indexing,content,title})
        res.json({success:true,message:'đã cập nhat'})
    }catch(error){
        console.log(error)
    }
}
const deleteFooter=async(req,res)=>{
    try{
        const footer=await Footer.findByPk(req.params.footerId)
        await footer.destroy()
        res.redirect('/admin/footer')
    }catch(error){
        console.log(error)
    }
}
const getAllBanner=async(req,res)=>{
    try{
        const banners=await Banner.findAll()
        res.render('admin/setting/banner',{banners})
    }catch(error){
        console.log(error)
    }
}
const addBanner=async(req,res)=>{
    try{
        const image=req.file?`/uploads/banner/${req.file.filename}`:''
        await Banner.create({image})
        res.redirect('/admin/banner')
    }catch(error){
        console.log(error)
    }
}
const showOrHide=async(req,res)=>{
    try{
        const banner=await Banner.findByPk(req.params.bannerId)
        banner.status=!banner.status
        await banner.save({fields:['status']})
        res.json({success:true,message:'update thành công'})
    }catch(error){
        console.log(error)
    }
}
const deleteBanner=async(req,res)=>{
    try{
        const banner=await Banner.findByPk(req.params.bannerId)
        await banner.destroy()
        res.redirect('/admin/banner')
    }catch(error){
        console.log(error)
    }
}

module.exports={getAllFooter,addFooter,editFooter,deleteFooter, getAllBanner,addBanner,showOrHide,deleteBanner,uploadBanner}
