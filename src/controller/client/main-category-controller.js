const {MainCategory, Category}=require('../../models/index')


const getMainCategory=async(req,res)=>{
    const id=req.params.mainCategoryId
    const mainCategory=await MainCategory.findOne({where:{id},include:[{model:Category}]})
    if(!mainCategory){
        return res.render('error',{error:'không tìm thấy danh mục này'})
    }
    res.render('client/main_category/main_category',{mainCategory})

}
module.exports={getMainCategory}