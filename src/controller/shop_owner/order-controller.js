const {Order}=require('../../models/index')
const changeOrderStatus=async(req,res)=>{
    try{
        const orderId=req.params.orderId
        const status=req.query.status
        const order=await Order.findByPk(orderId)
        order.status=status
        await order.save({ fields: ['status'] })
        res.redirect('/my-shop/orders?page=1')
    }catch(error){
        console.log(error)
    }
    
}
module.exports={changeOrderStatus}