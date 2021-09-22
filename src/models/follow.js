const db=require('../config/db')
const { DataTypes } = require('sequelize')


const Follow=db.define('Follow',{
    userId:DataTypes.INTEGER,
    shopId:DataTypes.INTEGER,
},{tableName:'follows',timestamps:false})
Follow.removeAttribute('id')

module.exports=Follow