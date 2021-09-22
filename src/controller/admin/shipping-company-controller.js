const {ShippingCompany}=require('../../models/index')


const getAddShippingCompany=async(req,res)=>{
    res.render('admin/shipping_company/add-shipping-company')
}

const addShippingCompany=async(req,res)=>{
    let {name,time}=req.body
    let isExist=await ShippingCompany.findOne({where:{name}})
    if(isExist){
        return res.json({error:'this name is exist'})
    }
    const newShippingCompany=await ShippingCompany.create({name,time})
    res.redirect('/admin/shipping-companies')
}

const getAllShippingCompany=async(req,res)=>{
    let shippingCompanies =await ShippingCompany.findAll()
    res.render('admin/shipping_company/shipping-companies',{shippingCompanies})
}

const updateTime=async(req,res)=>{
    try{
        console.log(req.body)
        const time=req.body.time
        const shippingCompany=await ShippingCompany.findByPk(req.params.id)
        shippingCompany.time=time
        await shippingCompany.save({fields:['time']})
        res.json({success:true,message:'update thành công'})
    }catch(error){
        res.json({success:false,message:error.message})
    }
    
}

const deleteShippingCompany=async(req,res)=>{
    try{
        let id=req.params.id
        let  shippingCompany=await ShippingCompany.findByPk(id)
        if(!shippingCompany){
            res.json({error:'unable to find shipping company '})
        }
        await shippingCompany.destroy()
        res.redirect('/admin/shipping-companies')
    }catch(error){
        console.log(error)
    }
    
}


module.exports={addShippingCompany,getAllShippingCompany,updateTime, deleteShippingCompany,getAddShippingCompany}