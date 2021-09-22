const db=require('../config/db')
const {DataTypes}=require('sequelize')
const User=require('./user')
const Item = require('./item')
const moment=require('moment')

const Shop=db.define('Shop',
    {
        name:{
            type:DataTypes.STRING,
            allowNull:false,
            unique:true
        },
        userId:{
            type:DataTypes.INTEGER,
            allowNull:false,
            unique:true,
        },
        address:DataTypes.STRING,
        revenue:{
            type:DataTypes.INTEGER,
            defaultValue:0,
            get(){
                return this.getDataValue('revenue').toLocaleString("en-US")
            }
        },
        status:{
            type:DataTypes.BOOLEAN,
            defaultValue:true,
        },
        reOpenOn:{
            type:DataTypes.DATE,
            set(value){
                if(this.status){
                    this.setDataValue('reOpenOn',null)
                }else{
                    this.setDataValue('reOpenOn',value)
                }
            }
        },
        createdAt:{
            type:DataTypes.DATE,
            get(){
                   return moment(this.getDataValue('createdAt')).format("MMM Do YY")
            }
        },
        image:DataTypes.STRING
    }    
)
Shop.rating=(shop)=>{
    const ratings=[]
    shop.Items.forEach((item)=>{
        item.Evaluates.forEach((evaluate)=>{
            ratings.push(evaluate.rating)
        })
    })
    if(!ratings.length){
        shop.rating=null
    }
    const avg= (ratings.reduce((current,total)=>total+current,0)/(ratings.length)).toFixed(2)
    shop.rating=avg
}

module.exports=Shop