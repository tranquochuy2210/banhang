const { DataTypes } = require('sequelize')
const db=require('../config/db.js')
const Shop=require('./shop')
const OrderItem=require('./order_item')
const Order=require('./order')
const moment = require('moment')
moment.locale('vi')

const Item=db.define('Item',{
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    shopId:{
        type:DataTypes.STRING,
        allowNull:false
    },
    description:{
        type:DataTypes.TEXT
    },
    originalPrice:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    discount:DataTypes.INTEGER,
    images:{
        type:DataTypes.JSON,
        async set(value){
            this.setDataValue('images',JSON.stringify(value))
        },
        get(){
            return JSON.parse(this.getDataValue('images'))
        }
    },

    stock:DataTypes.INTEGER,
    sold:DataTypes.INTEGER,
    stock:DataTypes.INTEGER,
    flashSale:{
        type:DataTypes.JSON,
        get(){
            return(JSON.parse(this.getDataValue('flashSale')))
        }
    },
    material:DataTypes.STRING,
    flashSaleTime:{
        type:DataTypes.DATE,
        set(value){
            let flashSaleTime=value?value:null
            this.setDataValue('flashSaleTime',flashSaleTime)
        },
        get(){
            if(this.getDataValue('flashSaleTime')){
                return(moment(this.getDataValue('flashSaleTime')).format('YYYY-MM-DDTHH:mm:ss'))
            }else{
                return null
            }
        }
    },
    pickUpTime:DataTypes.INTEGER,
    categoryId:DataTypes.INTEGER
})
Item.calculatePrice=(item)=>{
    if(item.flashSaleTime && 
        moment(Date.now()).valueOf()>moment(item.flashSaleTime).valueOf() && 
        moment(Date.now()).valueOf()<moment(moment(item.flashSaleTime).add(item.flashSale.duration,'minutes')).valueOf() 
        ){
            item.isFlashSale=true
            item.price=Math.floor(item.originalPrice*(1-item.discount/100-Number(item.flashSale.percent)/100-(item.voucher)/100))  
        }else{
            item.isFlashSale=false
            item.price=Math.floor(item.originalPrice*(1-item.discount/100-(item.voucher)/100))
        }
}
Item.isFlashSale=(item)=>{
    if(item.flashSaleTime && 
        moment(Date.now()).valueOf()>moment(item.flashSaleTime).valueOf() && 
        moment(Date.now()).valueOf()<moment(moment(item.flashSaleTime).add(item.flashSale.duration,'minutes')).valueOf() 
        ){
            const time=moment(moment(item.flashSaleTime).add(item.flashSale.duration,'minutes')).fromNow().split(' ')
            item.onSale='còn lại '+time[0] + ' '+ time[1]
        }else{
            item.onSale=false
        }
}
Item.countDown=(item)=>{
    if(item.flashSaleTime&&(moment(item.flashSaleTime).fromNow().endsWith('tới'))){
        item.countDown=moment(item.flashSaleTime).fromNow()
    }
}

module.exports=Item

