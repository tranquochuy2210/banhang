const Item=require('./item')
const Order=require('./order')
const OrderItem=require('./order_item')
const Category=require('./category')
const ShippingCompany=require('./shipping_company')
const Shop=require('./shop')
const User=require('./user')
const Evaluate=require('./evaluate')
const Follow=require('./follow')
const Voucher=require('./voucher')
const MainCategory = require('./main_category')
const Cart=require('./cart')

Order.belongsToMany(Item,{through:'OrderItem'})
Item.belongsToMany(Order,{through:'OrderItem'})


Order.belongsTo(ShippingCompany,{foreignKey:'shippingCompanyId'})
ShippingCompany.hasMany(Order,{foreignKey:'shippingCompanyId'})

Shop.hasMany(Item)
Item.belongsTo(Shop,{
    foreignKey:'shopId'
})
User.hasOne(Shop,{
    onDelete:'CASCADE'
})
Shop.belongsTo(User,{
  foreignKey:'UserId'
})

Category.hasMany(Item)
Item.belongsTo(Category,{foreignKey:'categoryId'})


Order.belongsTo(User,{foreignKey:'UserId'})
User.hasMany(Order)

OrderItem.belongsTo(Order,{foreignKey:'orderId'})
Order.hasMany(OrderItem)

OrderItem.belongsTo(Item,{foreignKey:'itemId'})
Item.hasMany(OrderItem,{foreignKey:'itemId'})

Evaluate.belongsTo(Item,{foreignKey:'itemId',foreignKeyConstraint: true,onDelete:'cascade'})
Item.hasMany(Evaluate,{foreignKey:'itemId',foreignKeyConstraint: true})

Evaluate.belongsTo(User,{foreignKey:'userId',onDelete:'CASCADE'})
User.hasMany(Evaluate,{hooks: true})

Follow.belongsTo(User,{foreignKey:'userId'})
User.hasMany(Follow,{onDelete:'CASCADE'})

Follow.belongsTo(Shop,{foreignKey:'shopId'})
Shop.hasMany(Follow,{onDelete:'CASCADE'})

Voucher.belongsTo(User,{foreignKey:'userId'})
User.hasMany(Voucher,{onDelete:'CASCADE'})

Voucher.belongsTo(Item,{foreignKey:'itemId',onDelete:'CASCADE'})
Item.hasMany(Voucher,{onDelete:'CASCADE'})

MainCategory.hasMany(Category)
Category.belongsTo(MainCategory,{foreignKey:'mainCategoryId'})

Cart.belongsTo(User,{foreignKey:'userId'})
User.hasMany(Cart,{foreignKey:'userId'})

Cart.belongsTo(Item,{foreignKey:'itemId'})
Item.hasMany(Cart,{foreignKey:'itemId'})



module.exports={Order,OrderItem,User,Item,Shop,ShippingCompany,Category,Evaluate,Follow,Voucher,MainCategory,Cart}