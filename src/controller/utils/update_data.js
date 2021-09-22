const { Item,Order, OrderItem} = require("../../models")
const moment=require('moment')

const updateItem=async()=>{
    try{
        let items=await Item.findAll()     
        for (let item of items){ 
            let {flashSaleTime}=item
            if(moment(Date.now())>moment(item.flashSaleTime).add(item.flashSale.duration,'minutes') || ! flashSaleTime){         
                item.flashSaleTime=null
                item.flashSale=JSON.stringify({})
                await item.save({field:['flashSaleTime','flashSale']})
            }}
    }catch(error){
        console.log(error)
    }
}
const updateOrder=async()=>{
    try{
        const allOrder=await Order.findAll({include:[{model:OrderItem}]})
        for(let order of allOrder){
            if(!order.OrderItems.length){
                await order.destroy()
            }
        }
    }catch(error){
        console.log(error)
    }
}

let update=()=>{
    setInterval(updateItem,10*1000)
    setInterval(updateOrder,10*1000)
}

module.exports=update

