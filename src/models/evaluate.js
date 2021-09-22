const moment=require('moment')
const db=require('../config/db')
const { DataTypes } = require('sequelize')
const { models, validate } = require('../config/db')


const Evaluate=db.define('Evaluate',{
    userId:DataTypes.INTEGER,
    itemId:DataTypes.INTEGER,
    comment:DataTypes.TEXT,
    rating:{
        type:DataTypes.INTEGER,
        validate:{
            min:0,
            max:5
        }
    },
    createdAt:{
        type:DataTypes.DATE,
        get(){
            return(moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss'))
        }
    }
},{tableName:'evaluates'})

module.exports=Evaluate