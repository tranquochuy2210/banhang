const {Shop,User}=require('../../models/index')

const getAllShop=async(req,res)=>{
    const shops=await Shop.findAll({include:[{model:User}]})
    res.render('admin/shop/shops',{shops})
}

module.exports={getAllShop}