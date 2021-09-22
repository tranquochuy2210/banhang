const { DataTypes } = require('sequelize')
const db=require('../config/db')


const ShippingCompany=db.define('ShippingCompany',{
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    time:{
        type:DataTypes.DECIMAL,
        allowNull:false
    }
})



module.exports=ShippingCompany