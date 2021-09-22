const express=require('express')
const router=express.Router()
const {uploadShopImage,editShop,deleteShop, getMyShop, getAllItems,getAllOrders,getRevenue,getRating}=require('../controller/shop_owner/shop-controller')
const {addItem,editItem,uploadItemImage, deleteItem,getEditItem,getAddItem,deleteImage}=require('../controller/shop_owner/item-controller')
const {isAuth,myShop,checkShopHasItem}=require('../middleware/auth')
const {addVoucher,deleteVoucher,addVoucherImage, getAddVoucher}=require('../controller/shop_owner/voucher-controller')
const {getCategoryByMainCategory}=require('../controller/shop_owner/category-controller')
const {changeOrderStatus}=require('../controller/shop_owner/order-controller')

//shop info
router.get('/homepage',isAuth,myShop,getMyShop)
router.get('/items',isAuth,myShop,getAllItems)
router.get('/orders',isAuth,myShop,getAllOrders)
router.get('/revenue',isAuth,myShop,getRevenue)
router.get('/rating',isAuth,myShop,getRating)
router.delete('/delete-shop',isAuth,myShop,deleteShop)
router.put('/edit-shop/:shopId',isAuth,myShop,uploadShopImage,editShop)

//item
router.get('/add-item',isAuth,myShop,getAddItem)
router.post('/add-item',isAuth,myShop,uploadItemImage,addItem)
router.get('/edit-item/:itemId',isAuth,myShop,checkShopHasItem,getEditItem)
router.put('/edit-item/:itemId',isAuth,myShop,checkShopHasItem,uploadItemImage,editItem)
router.delete('/delete-image/:itemId',isAuth,myShop,checkShopHasItem,deleteImage)
router.delete('/delete-item/:itemId',isAuth,myShop,checkShopHasItem,deleteItem)


//voucher
router.post('/add-voucher/:itemId',isAuth,myShop,checkShopHasItem,addVoucherImage,addVoucher)
router.get('/add-voucher/:itemId',isAuth,myShop,checkShopHasItem,getAddVoucher)
router.delete('/delete-voucher',deleteVoucher)

//category
router.get('/categories/:mainCategoryId',getCategoryByMainCategory)

//order 
router.get('/order/change-status/:orderId',isAuth,myShop,changeOrderStatus)


module.exports=router