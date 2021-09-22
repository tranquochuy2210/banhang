const {OrderItem,Order,Item,ShippingCompany,Shop,Voucher}=require('../../models/index.js')
const moment=require('moment')

let addOrderItem=async(req,res)=>{
    try{
        const {orderId,itemId,quantity,price}=req.body
        if(!orderId||!itemId){
            return res.json({error:'orderId and itemId must be provided'})
        }
        let order=await Order.findOne({where:{id:orderId},include:[{model:ShippingCompany}]})
        let item=await Item.findOne({where:{id:itemId},include:[{model:Shop}]})
        if(!order || !item){
            return res.json({error:'cannot find order or item'})
        }
        const orderItem=await OrderItem.findOne({where:{orderId,itemId}})
        
        if(!orderItem){
            await order.addItem(item,{through:{quantity,price}})
        }else{
            orderItem.quantity+=Number(quantity)
            orderItem.price+=Number(price)
            await orderItem.save()
        }
        const voucher=await Voucher.findOne({where:{userId:req.user.id,itemId}})
        if(voucher){
            await voucher.destroy()
        }
        
        if(item.stock<Number(quantity)){
            return res.json({success:false, message:'sản phẩm không đủ số lượng'})
        }
        await item.increment({'sold':Number(quantity)})
        await item.decrement({'stock':Number(quantity)})
        await item.Shop.increment({'revenue':Number(price)})
        let pickUpTime=item.pickUpTime
        let shippingTime=Number(order.ShippingCompany.time)
        //update time delivery
        if(!order.deliveryDate ||moment(order.deliveryDate).valueOf() <(Date.now() +(pickUpTime+shippingTime)*86400000 )){
            order.deliveryDate=(moment(Date.now() +(pickUpTime+shippingTime)*86400000).format('MM-DD-YYYY'))
        }
        await order.save({ fields: ['deliveryDate'] })
        res.json({success:true,message:'them thanh cong'})
    }catch(error){
        console.log(error)
    }
}

let deleteOrderItem=async(req,res)=>{
    try{
        let {itemId,orderId}=req.body
        console.log(req.body)
        let orderItem=await OrderItem.findOne({where:{itemId,orderId}})
        if(!orderItem){
            return res.json({success:false,message:'order-item không tồn tại'})
        }
        await orderItem.destroy()
        res.json({success:true,message:'đã xóa vật phẩm trong đơn hàng'})
    }catch(error){
        res.status(500).json({success:false,message:error.message})
    }
}

module.exports= {addOrderItem,deleteOrderItem}