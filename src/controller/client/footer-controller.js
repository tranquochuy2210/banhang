const Footer=require('../../models/footer')
const getFooters=async(req,res)=>{
    try{
        const footers=await Footer.findAll()
        res.json({footers})
    }catch(error){
        console.log(error)
    }
    
}
module.exports={getFooters}