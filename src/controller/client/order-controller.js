const {User,Order,ShippingCompany, Item, OrderItem,Shop}=require('../../models/index')
const {sendOrderConfirm}=require('../../service/email')

const addOrder=async(req,res)=>{
    try{
        const {shippingCompanyId}=req.body
        const userId=req.user.id
        if(!userId){
            return res.json({error: 'user must be provide'})
        }
        let user=await User.findByPk(userId)
        let shipping=await ShippingCompany.findByPk(shippingCompanyId)
        if(!user){
            return res.json({error:'unable to find user'})
        }
        if(!shipping){
            return res.json({error:'unable to find shipping company'})
        }
        let address=req.body.address?req.body.address:user.address
        let newOrder=await Order.create({userId,shippingCompanyId,address})
        res.json({success:true,newOrder})
    }catch(error){
        console.log(error)
    }
    
}
const getOrderById=async(req,res)=>{
    try{
        const id=req.params.id
        let order=await Order.findAll({
            where:{id},
            include:[{
                model:User,attributes:['name']
            },{
                model:ShippingCompany,attributes:['name']
            },{
                model:OrderItem,include:[{model:Item,attributes:['name','price']}],attributes:['quantity']
            }
            ]})
        res.json(order)
    }catch(error){
        console.log(error)
    }
}
const getAllOrders=async(req,res)=>{
    let orders=await Order.findAll({
        include:[{
            model:User,attributes:['name']
        },{
            model:ShippingCompany,attributes:['name']
        },{
            model:OrderItem,include:[{model:Item,attributes:['name','price']}],attributes:['quantity']
        }
        ]})
    res.json(orders)
}
const getOrdersByUser=async(req,res)=>{
    const userId=req.params.id
    let orders=await Order.findAll({
        where:{userId},
        include:[{
            model:User,attributes:['name']
        },{
            model:ShippingCompany,attributes:['name']
        },{
            model:OrderItem,include:[{model:Item,attributes:['name','price']}],attributes:['quantity']
        }
        ]})
        res.json(orders)
}
const editOrder=async(req,res)=>{
    let orderId=req.params.id
    let order=await Order.findByPk(orderId)
    if(!order){
        return res.json({error:'unable to find order'})
    }
    let address=req.body.address?req.body.address:order.address
    let userId=req.body.userId?req.body.userId:order.userId
    let shippingCompanyId=req.body.shippingCompanyId?req.body.shippingCompanyId:order.shippingCompanyId
    let status=req.body.status?req.body.status:order.status
    let user=await User.findByPk(userId)
    let shipping=await ShippingCompany.findByPk(shippingCompanyId)
    if(!user){
        return res.json({error:'unable to find user'})
    }
    if(!shipping){
        return res.json({error:'unable to find shipping company'})
    }
    let newOrder=await order.update({userId,shippingCompanyId,address,status})
    res.send(newOrder)
}
const cancelOrder=async(req,res)=>{
    try{
        let id=req.params.orderId
        let order=await Order.findOne({where:{id},include:[{model:OrderItem,include:[{model:Item,include:[{model:Shop}]}]}]})
        if(!order){
            return res.json({success:false,message:'đơn hàng không tồn tại'})
        }
        if(order.status === 'deleted'){
            return res.json({success:false,message:'đơn hàng đã xóa trước đó'})
        }
        if(order.userId!== req.user.id){
            return res.json({success:false,message:'không có quyền xóa đơn hàng này'})
        }
        for(let orderItem of order.OrderItems){
            const shop=orderItem.Item.Shop
            await shop.decrement({'revenue':orderItem.price})
        }
        await order.update({status:'deleted'})
        res.json({success:true,message:'đã xóa đơn hàng thành công'})
    }catch(error){
        console.log(error)
    }
    
}

const deleteOrder=async(req,res)=>{
    try{
        const id=req.params.orderId
        const order=await Order.destroy({where:{id}})
        res.json({success:true,message:'deleted'})
    }catch(error){
        res.json({success:false,message:error.message})
    }
    
}
const orderClosing=async (req,res)=>{
    try{
        const order=await Order.findByPk(req.params.orderId)
        const user=req.user
        sendOrderConfirm(user,order)
        res.json({success:true})
    }catch(error){
        console.log(error)
    }
    
}



module.exports={addOrder,getOrdersByUser,getAllOrders,getOrderById,editOrder,deleteOrder,cancelOrder,orderClosing}