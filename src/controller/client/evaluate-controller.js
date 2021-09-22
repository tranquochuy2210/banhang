const {Evaluate,Item}=require('../../models/index')


const addEvaluate=async(req,res)=>{
    let {itemId,comment,rating}=req.body
    try{
        let userId=req.user.id
        let item=await Item.findByPk(itemId)
        if(!item){
            return res.render('error',{error:'cannot find item'})
        }
        let newEvaluate=await Evaluate.create({itemId,comment,rating,userId})
        res.json({success:true,newEvaluate})
    }catch(error){
        console.log(error)
    }
}
const deleteEvaluate=async(req,res)=>{
    try{
        let id=req.params.id
        let evaluate=await Evaluate.findByPk(id)
        if(req.user.id !== evaluate.userId ){
            return res.status(401).json({success:false,error:'you have not authorized to do this'})
        }
        await evaluate.destroy()
        return res.status(200).json({success:true})

    }catch(error){
        res.json({success:true})
    }
}


module.exports={addEvaluate,deleteEvaluate}