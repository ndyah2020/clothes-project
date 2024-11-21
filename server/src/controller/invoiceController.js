const mongoose = require("mongoose");
const InvoiceModel = require('../models/Invoice');
const InvoiceDetailModel = require('../models/InvoiceDetail');
const CustomerModel = require('../models/Customer');
const ProductModel = require('../models/Product');
const PromotionModel = require('../models/Promotion');
const MonetaryNormModel = require('../models/MonetaryNorm');

class InvoiceController {
    //Hiển thị thông tin hóa đơn
    
    async getInvoices(req, res) {
        try {
            const invoices = await InvoiceModel.find()
                .populate('customer', 'name phonenumber point') 
                .populate({
                    path: 'invoiceDetails',
                    populate: {
                        path: 'product', 
                        select: 'name price', 
                    },
                });

            res.status(200).json(invoices);
        } catch (error) {
            console.error('Error retrieving invoices:', error);
            res.status(500).json({ message: 'Error retrieving invoices', error });
        }
    }
    
    async getInvoiceById(req, res) {
        const { id } = req.params;
        try {
            const invoices = await InvoiceModel.find()
            .populate('customer', 'name phonenumber')
            .populate({
                path: 'invoiceDetails', 
                select: 'selectedSize quantity total', 
                populate: {
                    path: 'product', 
                    select: 'name sizes', 
                },
            });

            if (!invoice) {
                return res.status(404).json({ message: 'Invoice not found' });
            }

            res.status(200).json(invoice);
        } catch (error) {
            console.error('Error retrieving invoice:', error);
            res.status(500).json({ message: 'Error retrieving invoice', error });
        }
    }
    //Tạo hóa đơn và chi tiết hóa đơn
    async CreateInvoiceWithDetails(req, res) {
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

        if (!customerPhone || !orderType || !totalPrice || !Array.isArray(cart) || cart.length === 0) {
            return res.status(400).json({ message: 'Missing required fields or empty cart' });
        }

        try {
            // Kiểm tra khách hàng
            const customer = await CustomerModel.findOne({ phonenumber: customerPhone });
            if (!customer) {
                return res.status(400).json({ message: 'Customer not found. Please check again.' });
            }

            // Kiểm tra mã giảm giá (nếu có)
            let validPromo = null;
            if (promoCode) {
                validPromo = await PromotionModel.findOne({ name: promoCode.toUpperCase() });
                if (!validPromo) {
                    return res.status(400).json({ message: 'Promo code not found' });
                }
            }

            // Tạo hóa đơn
            const newInvoice = new InvoiceModel({
                customer: customer._id,
                orderType,
                shippingAddress: orderType === 'online' ? shippingAddress : '',
                shippingFee,
                promoCode: validPromo ? validPromo._id : null,
                discount: customerDiscount,
                totalPrice,
            });
            const savedInvoice = await newInvoice.save();

            // Tạo chi tiết hóa đơn
            const invoiceDetails = cart.map((item) => ({
                invoice: savedInvoice._id,
                product: item._id,
                selectedSize: item.selectedSize.size,
                quantity: item.quantity,
                unitPrice: item.selectedSize.price,
                total: item.quantity * item.selectedSize.price,
            }));
            await InvoiceDetailModel.insertMany(invoiceDetails);

            // Lấy quy định điểm thưởng
            const monetaryNorm = await MonetaryNormModel.findOne();
            if (!monetaryNorm) {
                return res.status(400).json({ message: 'Monetary norm not found' });
            }

            // Tính điểm thưởng
            const newPointCustomer = Math.round(totalPrice / monetaryNorm.moneyPerPoint);
            customer.point += newPointCustomer;
            await customer.save();

            // Trả kết quả
            res.status(201).json({ message: "Invoice created successfully", invoice: savedInvoice });
        } catch (error) {
            console.error("Error creating invoice:", error);
            res.status(500).json({ message: "Error creating invoice", error: error.message });
        }
    }
}

module.exports = new InvoiceController();
