const InvoiceModel = require('../models/Invoice');
const InvoiceDetailModel = require('../models/InvoiceDetail');
const CustomerModel = require('../models/Customer');
const ProductModel = require('../models/Product');
const promotion = require('../models/Promotion')
const mongoose = require("mongoose");

class InvoiceController {

    async CreateInvoiceWithDetails (req, res) {
        const {
            customerPhone,
            orderType,
            shippingAddress,
            shippingFee,
            promoCode,
            discount,
            totalPrice,
            cart, 
          } = req.body;

          if (!customerPhone || !orderType || !totalPrice || !Array.isArray(cart) || cart.length === 0) {
            return res.status(400).json({message: 'Missing required fields or empty cart',});
          }
        try{
            //Customer này đã được tạo khi ấn xác nhận đơn hàng. Đã được kiểm tra 
            const customer = await CustomerModel.findOne({phonenumber: customerPhone})
            console.log(customer)
            if(!customer){
                return res.status(400).json({message: 'custommer ',});
            }
            const newInvoice = new InvoiceModel({
                customer : customer._id,
                orderType,
                shippingAddress: orderType === 'online' ? shippingAddress : '',
                shippingFee,
                promoCode,
                discount,
                totalPrice,
            });
            const savedInvoice =  await newInvoice.save()
            console.log(savedInvoice)

            const invoiceDetails = cart.map((item) => ({
                invoice: savedInvoice._id,
                product:  new mongoose.Types.ObjectId(item._id),
                selectedSize: item.selectedSize.size,
                quantity: item.quantity,
                unitPrice: item.selectedSize.price,
                total: item.quantity * item.selectedSize.price,
            }));

            // Lưu chi tiết hóa đơn
            await InvoiceDetailModel.insertMany(invoiceDetails);

            res.status(201).json(savedInvoice);

        }catch(error){
            console.error("Error creating invoice:", error);
            res.status(500).json({ message: "Error creating invoice", error });
        }
    }

}

module.exports = new InvoiceController();