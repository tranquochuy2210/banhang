const { DataTypes } = require('sequelize')
const db=require('../config/db')



const MainCategory=db.define('MainCategory',{
    name:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    logo:DataTypes.STRING
},{
    tableName:'main_categories'
}
)


module.exports=MainCategory