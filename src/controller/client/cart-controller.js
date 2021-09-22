const {Cart, Item}=require('../../models/index')

const addCart=async(req,res)=>{
    try{
        const userId=req.user.id
        const {itemId,quantity}=req.body
        const cart=await Cart.create({userId,itemId,quantity})
        res.json({success:true,message:'sản phẩm được thêm vào giỏ hàng'})
    }catch(error){
        res.json({success:false,message:error.message})
    }
   
}
const deleteCart=async (req,res)=>{
    try{
        const cartId=req.params.id
        const cart=await Cart.findByPk(cartId)
        if(req.user.id!==cart.userId){
            return res.json({success:false,message:'not authorize'})
        }
        await cart.destroy()
        res.json({success:true,message:'deleted'})
    }catch(error){
        res.json({success:true,message:error.message})
    }
}


module.exports={addCart,deleteCart}