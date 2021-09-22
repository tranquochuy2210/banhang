const { DataTypes,Model} = require('sequelize')
const moment =require('moment')
const db=require('../config/db')



const Order=db.define('Order',{
    userId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    status:{
        type:DataTypes.ENUM('preparing','transporting','deleted','completed'),
        defaultValue:'preparing'
    },
    deliveryDate:{
        type:DataTypes.DATEONLY,
        get(){
            return (this.getDataValue('deliveryDate')?moment(this.getDataValue('deliveryDate')).format("MM-DD-YYYY"):null)
        }
    },
    shippingCompanyId:DataTypes.INTEGER,
    address:DataTypes.STRING
},{
})


module.exports=Order