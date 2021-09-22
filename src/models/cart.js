const { DataTypes,Model} = require('sequelize')
const moment =require('moment')
const db=require('../config/db')



const Cart=db.define('Cart',{
    userId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    itemId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    quantity:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
})


module.exports=Cart