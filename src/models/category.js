const { DataTypes } = require('sequelize')
const db=require('../config/db')
const Item=require('./item')


const Category=db.define('Category',{
    name:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    logo:DataTypes.STRING,
    mainCategoryId:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
}
)


module.exports=Category