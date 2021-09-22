const db=require('../config/db')
const { DataTypes } = require('sequelize')


const Banner=db.define('Banner',{
    image:DataTypes.STRING,
    status:{
        type:DataTypes.BOOLEAN,
        defaultValue:true
}})



module.exports=Banner