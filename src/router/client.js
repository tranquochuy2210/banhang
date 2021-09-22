const express=require('express')
const router=express.Router()
const {getItemById,getAllItems,getItemByCategory}=require('../controller/client/item-controller')
const {addEvaluate,deleteEvaluate}=require('../controller/client/evaluate-controller')
const {isAuth,notHaveShop}=require('../middleware/auth')
const {addFollow,deleteFollow}=require('../controller/client/follow-controller')
const {addCart,deleteCart}=require('../controller/client/cart-controller')
const {addOrderItem,deleteOrderItem}=require('../controller/client/order-item-controller')
const {addOrder, getOrdersByUser, getAllOrders, getOrderById, editOrder, deleteOrder, cancelOrder, orderClosing}=require('../controller/client/order-controller')
const {getUser,uploadAvatar,getUserInfo,editUser,updateAvatar,getChangePassword,changePassword,getOrder,getOrderByUser,getVoucherByUser,getMyCart}=require('../controller/client/user-controller')
const { getMainCategory } = require('../controller/client/main-category-controller')
const {getShop,getAddShop,addShop}=require('../controller/client/shop-controller')
const {getFooters}=require('../controller/client/footer-controller')
const {getHomepage,login,getLogin,logOut,register,getRegister}=require('../controller/auth')


router.get('/register',getRegister)
router.post('/register',uploadAvatar,register)
router.get('/login',getLogin)
router.post('/login',login)
router.get('/log-out',logOut)

router.get('/',getHomepage)

//get user for header
router.get('/user',getUser)

//get main_category
router.get('/main-category/get-category/:mainCategoryId',getMainCategory)

//personal
router.get('/user/account/profile',isAuth,getUserInfo)
router.post('/user/account/update-avatar',isAuth,uploadAvatar,updateAvatar)
router.post('/user/account/edit-user',isAuth,editUser)
router.get('/user/account/password',isAuth,getChangePassword)
router.post('/user/account/password',isAuth,changePassword)
router.get('/user/account/my-order',isAuth,getOrder)
router.get('/user/order',isAuth,getOrderByUser)
router.get('/user/account/vouchers',isAuth,getVoucherByUser)
router.get('/user/account/cart',isAuth,getMyCart)

//shop
router.get('/get-shop/:shopId',getShop)
router.get('/shop/add-shop',notHaveShop,isAuth,getAddShop)
router.post('/shop/add-shop',notHaveShop,isAuth,addShop)

//item
router.get('/get-item/:id',getItemById)
router.get('/get-all-items',getAllItems)
router.get('/get-item-by-category/:categoryId',getItemByCategory)


//evaluate
router.post('/add-evaluate',isAuth,addEvaluate)
router.delete('/delete-evaluate/:id',deleteEvaluate)


//follow
router.get('/delete-follow/:shopId',isAuth,deleteFollow)
router.get('/add-follow/:shopId',isAuth,addFollow)


//cart
router.post('/add-cart',isAuth,addCart)
router.delete('/delete-cart/:id',isAuth,deleteCart)


//order
router.post('/add-order',isAuth,addOrder)
router.get('/get-orders-by-user/:id',getOrdersByUser)
router.get('/get-all-orders',getAllOrders)
router.get('/get-order/:id',getOrderById)
router.put('/edit-order/:id',editOrder)
router.get('/cancel-order/:orderId',cancelOrder)
router.delete('/delete-order/:orderId',deleteOrder)
router.get('/order-closing/:orderId',orderClosing)


//order_item
router.post('/add-order-item',isAuth,addOrderItem)
router.delete('/delete-order-item',deleteOrderItem)

router.get('/footers',getFooters)

module.exports=router