const Order=require('./order')
const Item=require('./item')
const db=require('../config/db')
const { DataTypes } = require('sequelize')
const { models } = require('../config/db')
const OrderItem=db.define('OrderItem',{
    orderId:{
        type:DataTypes.INTEGER, 
    },itemId:{
        type:DataTypes.INTEGER,
    },
    quantity:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    price:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
},{tableName:'order_items',timestamps:false})



module.exports=OrderItem
