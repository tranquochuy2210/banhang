const {Category}=require('../../models/index')
const {upload}=require('../utils/add_file')
const getCategoryByMainCategory=async(req,res)=>{
    try{
        let categories=await Category.findAll({where:{mainCategoryId:req.params.mainCategoryId}})
        res.status(200).json({success:true,categories})
    }catch(error){
        res.status(500).json({success:false,message:error.message})
    }
}
module.exports={getCategoryByMainCategory}