const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
  service:"hotmail",
  auth: {
    user: 'tranquochuy221096@outlook.com', 
    pass: 'claybon123',
  },
});

const sendOrderConfirm= (user, order) => {
  console.log(user.email)
  transporter.sendMail({
    from: 'tranquochuy221096@outlook.com',
    to: `${user.email}`, 
    subject: "xác nhận đơn hàng", 
    html: `<b> xin chào ${user.lastName},đơn hàng ${order.id} sẽ được giao vào ngày ${order.deliveryDate}</b>`, 
  },(error,info)=>{
    if(error){
      return
    }
  })
}
      
module.exports = {
    sendOrderConfirm
}