const {DataTypes}=require('sequelize')
const db =require('../config/db')


const Voucher=db.define('Voucher',{
    userId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    itemId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    percent:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    description:{
        type:DataTypes.INTEGER,
    },
    image:{
        type:DataTypes.INTEGER,
    },
    expirationDate:{
        type:DataTypes.DATE
    }
},{
    timestamps:false
})
Voucher.removeAttribute('id')


module.exports=Voucher