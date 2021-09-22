const { Sequelize } = require('sequelize');

module.exports= new Sequelize('shopee', 'root', 'route', {
    host: 'localhost',
    dialect: 'mysql',
    timezone:'+07:00'
  });
