const {Follow,Shop}=require('../../models/index')


const addFollow=async(req,res)=>{
    try{
        const userId=req.user.id
        const shopId=req.params.shopId
        console.log(userId,shopId)
        if(!userId || !shopId){
            return res.json({success:false,message:'shop and user must be provide'})
        }
        let shop=await Shop.findByPk(shopId)
        if(!shop){
            return res.json({success:false,message:'shop does not exist'})
        }
        await Follow.create({userId,shopId})
        res.json({success:true})
    }catch(error){
        res.json({success:false,message:error.message})
    }
    
}
const deleteFollow=async(req,res)=>{
    try{
        const userId=req.user.id
        const shopId=req.params.shopId
        if(!userId || !shopId){
            return res.json({success:false,message:'shop and user must be provide'})
        }
        let follow=await Follow.findOne({where:{userId,shopId}})
        if(!follow){
            return res.json({success:false,message:'user does not follow'})
        }
        await follow.destroy()
        return res.json({success:true})

    }catch(error){
        res.json({success:false,message:error.message})
    }
    
}

module.exports={addFollow,deleteFollow}