const express=require('express')
const {addShippingCompany, getAddShippingCompany, getAllShippingCompany, updateTime, deleteShippingCompany}=require('../controller/admin/shipping-company-controller')
const {addCategory, deleteCategory, uploadCategoryLogo, getCategoryByMainCate, changeCategoryLogo, getAddCategory}=require('../controller/admin/category-controller')
const {getAdminLogin, adminLogin, getHomepage}=require('../controller/admin/auth-controller')
const { isAdmin, isAuth, moveToAdminHP } = require('../middleware/auth')
const {getAllUsers, changeRole, deleteAccount, getUser}=require('../controller/admin/user-controller')
const {getAllMainCategories, changeMainCategoryLogo, uploadMainCategoryLogo, getAddMainCategory, addMainCategory, deleteMainCategory}=require('../controller/admin/main-category-controller')
const { getAllShop } = require('../controller/admin/shop-controller')
const { getAllFooter, addFooter, editFooter, deleteFooter, getAllBanner, addBanner, showOrHide, deleteBanner, uploadBanner} = require('../controller/admin/setting-controller')

const router=express.Router()


//login
router.get('/login',moveToAdminHP,getAdminLogin)
router.post('/login',adminLogin)
router.get('/homepage',isAdmin,getHomepage)


//user
router.get('/users',isAdmin,getAllUsers)
router.get('/change-role/:userId',isAdmin,changeRole)
router.get('/delete-account/:userId',isAdmin,deleteAccount)
router.get('/user/:userId',isAdmin,getUser)

//shipping company

router.get('/add-shipping-company',isAuth,isAdmin,getAddShippingCompany)
router.post('/add-shipping-company',isAuth,isAdmin,addShippingCompany)
router.get('/shipping-companies',isAuth,isAdmin,getAllShippingCompany)
router.post('/update-ship-time/:id',isAdmin,updateTime)
router.get('/delete-shipping-company/:id',isAdmin,deleteShippingCompany)



//main category
router.get('/main-categories',isAdmin,getAllMainCategories)
router.put('/main-category/change-logo/:id',isAdmin,uploadMainCategoryLogo,changeMainCategoryLogo)
router.get('/add-main-category',isAdmin,getAddMainCategory)
router.post('/add-main-category',isAdmin,uploadMainCategoryLogo,addMainCategory)
router.get('/delete-main-category/:id',isAdmin,deleteMainCategory)

//category
router.get('/categories/:mainCateId',isAdmin,getCategoryByMainCate)
router.put('/category/change-logo/:id',isAdmin,uploadCategoryLogo,changeCategoryLogo)
router.get('/add-category/:mainCateId',isAdmin,getAddCategory)
router.post('/add-category/:mainCateId',isAdmin,uploadCategoryLogo,addCategory)
router.get('/delete-category/:id',isAdmin,deleteCategory)

//shop
router.get('/shops',isAdmin,getAllShop)

//footer
router.get('/footer',isAdmin,getAllFooter)
router.post('/add-footer',isAdmin,addFooter)
router.put('/edit-footer/:footerId',isAdmin,editFooter)
router.get('/delete-footer/:footerId',isAdmin,deleteFooter)

//banner
router.get('/banner',isAdmin,getAllBanner)
router.post('/add-banner', isAdmin, uploadBanner,addBanner)
router.get('/change-status/:bannerId',isAdmin,showOrHide)
router.get('/delete-banner/:bannerId',isAdmin,deleteBanner)


module.exports=router