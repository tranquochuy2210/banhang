const {Voucher, User, Item,Follow}=require('../../models/index')
const {upload}=require('../utils/add_file')

const addVoucherImage=upload.single('voucher')
const getAddVoucher=(req,res)=>{
    res.render('my_shop/voucher/add-voucher',{item:req.item})
}
const addVoucher=async (req,res)=>{
    try{
        console.log(req.body)
        const itemId=req.item.id
        const {target,percent,description,expirationDate}=req.body
        const users=[]
        if(target==='all'){
            const dataset=await User.findAll()
            dataset.forEach((data)=>{
                users.push(data.id)
            })
        }else{
            const dataset=await Follow.findAll({where:{shopId:req.shop.id}})
            dataset.forEach((data)=>{
                users.push(data.userId)
            })
        }
        const image=req.file?`/uploads/voucher/${req.file.filename}`:null
        if(!users.length){
            return res.redirect('/my-shop/items')
        }
        for(let userId of users){
            const existVoucher=await Voucher.findOne({where:{userId,itemId}})
            if(existVoucher){
                let newPercent=percent>existVoucher.percent?percent:existVoucher.percent
                await existVoucher.update({percent:newPercent,image,description,expirationDate})
            }else{
                await Voucher.create({userId,itemId,percent,image,description,expirationDate})
            }
        }
        return res.redirect('/my-shop/items')
    }catch(error){
        console.log(error)
        return res.json({success:false,message:'lỗi server'})
    }
}
const deleteVoucher=async(req,res)=>{
    try{
        const {userId,itemId}=req.body
        const voucher=await Voucher.findOne({where:{userId,itemId}})
        if(!voucher){
            return res.json({success:false,message:'Không tìm thấy voucher'})
        }else{
            await voucher.destroy()
            return res.json({success:true,message:'Xóa voucher thành công'})
        }
    }catch(error){
        console.log(error)
        return res.json({success:false,message:'lỗi server'})
    }
}
module.exports={addVoucher, deleteVoucher, addVoucherImage, getAddVoucher}
