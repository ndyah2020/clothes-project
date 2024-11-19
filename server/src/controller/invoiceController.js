const InvoiceModel = require('../models/Invoice');
const InvoiceDetailModel = require('../models/InvoiceDetail');
const CustomerModel = require('../models/Customer');
const ProductModel = require('../models/Product');
const promotion = require('../models/Promotion')
class InvoiceController {

    async CreateInvoiceWithDetails (req, res) {
        const {
            phonenumber,
            orderType,
            shippingAddress,
            shippingFee,
            promoCode,
            totalPrice,
            cart, 
          } = req.body;

          if (!phonenumber || !orderType || !totalPrice || !Array.isArray(cart) || cart.length === 0) {
            return res.status(400).json({message: 'Missing required fields or empty cart',});
          }

        try{
            //Customer này đã được tạo khi ấn xác nhận đơn hàng. Đã được kiểm tra 
            const customer = await CustomerModel.findOne({phonenumber})
            
            const newInvoice = new InvoiceModel({
                csutomer: customer._id,
                orderType,
                shippingAddress: orderType === 'online' ? shippingAddress : '',
                shippingFee,
                promoCode,
                discount,
                totalPrice,
            });
        }catch(error){
            
        }
    }

}

module.exports = new InvoiceController();