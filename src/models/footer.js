const db=require('../config/db')
const { DataTypes } = require('sequelize')


const Footer=db.define('Footer',{
    indexing:{
        type:DataTypes.ENUM('customer care','about me','social network','contact','check out')
    },
    title:DataTypes.STRING,
    content:DataTypes.STRING
})



module.exports=Footer