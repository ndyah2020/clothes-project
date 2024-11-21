const InvoiceModel = require('../models/Invoice');
const InvoiceDetailModel = require('../models/InvoiceDetail');
const CustomerModel = require('../models/Customer');
const ProductModel = require('../models/Product');
const PromotionModel = require('../models/Promotion')
const MonetaryNormModel = require('../models/MonetaryNorm')

const mongoose = require("mongoose");
class InvoiceController {

    async CreateInvoiceWithDetails (req, res) {
        const {
            customerPhone,
            orderType,
            shippingAddress,
            shippingFee,
            promoCode,
            customerDiscount,
            totalPrice,
            cart, 
          } = req.body;
          console.log(customerDiscount)
          if (!customerPhone || !orderType || !totalPrice || !Array.isArray(cart) || cart.length === 0) {
            return res.status(400).json({message: 'Missing required fields or empty cart',});
          }

        try{
            //Customer này đã được tạo khi ấn xác nhận đơn hàng. Đã được kiểm tra 
            const customer = await CustomerModel.findOne({phonenumber: customerPhone})
            if(!customer){
                return res.status(400).json({message: 'Please click check'});
            }
            let validPromo = null
            if(promoCode){
                validPromo = await PromotionModel.findOne({name: promoCode.toUpperCase()});
                if (!validPromo) {
                    return res.status(400).json({ message: 'Promo code not found' });
                }
            }
            
            const newInvoice = new InvoiceModel({
                customer : customer._id,
                orderType,
                shippingAddress: orderType === 'online' ? shippingAddress : '',
                shippingFee,
                promoCode: validPromo ? new mongoose.Types.ObjectId(validPromo._id) : null,
                discount: customerDiscount,
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
            await InvoiceDetailModel.insertMany(invoiceDetails);

            const monetaryNorm = await MonetaryNormModel.findOne()
            if(!monetaryNorm){
                return res.status(400).json({ message: 'Monetary norm not found' });
            }

            const newPointCustomer = Math.round(totalPrice / monetaryNorm.moneyPerPoint);
            customer.point += newPointCustomer

            await customer.save()
            res.status(201).json(savedInvoice);

        }catch(error){
            console.error("Error creating invoice:", error);
            res.status(500).json({ message: "Error creating invoice", error });
        }
    }

}

module.exports = new InvoiceController();