const {Sequelize, DataTypes, ENUM}=require('sequelize')
const db =require('../config/db')
const Shop=require('./shop')
const Order=require('./order')
const moment=require('moment')
const User=db.define('User', {
    // Model attributes are defined here
    email: {
      type: DataTypes.STRING,
      allowNull:false,
      validate:{
        isEmail: true
      }
    },
    firstName: {
      type: DataTypes.STRING,
    },
    lastName:{     
        type: DataTypes.STRING,
    },
    password:{
        type: DataTypes.STRING,
        allowNull:false,
    },
    phone:DataTypes.STRING,
    gender:{
        type:DataTypes.ENUM('male','female','other')
    },
    birthDate:{
        type:DataTypes.DATEONLY
    },
    avatar:{
        type:DataTypes.STRING
    },
    address:{
      type:DataTypes.STRING
    },
    role:{
      type:DataTypes.ENUM('user','admin'),
      defaultValue:'user'
    },
    createdAt:{
      type:DataTypes.DATE,
      get(){
        return moment(this.getDataValue('createdAt')).format("MMMM Do YYYY")

      }
    }
  });



  module.exports=User