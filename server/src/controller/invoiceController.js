const InvoiceModel = require('../models/Invoice');
const InvoiceDetailModel = require('../models/InvoiceDetail');
const CustomerModel = require('../models/Customer');
const PromotionModel = require('../models/Promotion');
const MonetaryNormModel = require('../models/MonetaryNorm');
const UserModel = require('../models/User')
const EmployeModel = require('../models/Employee')

class InvoiceController {
    //Hiển thị thông tin hóa đơn

    async getInvoices(req, res) {
        try {
            const invoices = await InvoiceModel.find()
                .populate('customer', 'name phonenumber point')
                .populate('promoCode', 'name discount startTime endTime')
                .populate('employeeGetByUser', 'firstName lastName email accountStatus')
                .populate({
                    path: 'invoiceDetails',
                    populate: {
                        path: 'product',
                        select: 'name sku',
                    },
                });

            res.status(200).json(invoices);
        } catch (error) {
            console.error('Error retrieving invoices:', error);
            res.status(500).json({ message: 'Error retrieving invoices', error });
        }
    }
    //Lấy thông tin hóa đơn theo id
    async getInvoiceById(req, res) {
        const { id } = req.params;
        try {
            const invoices = await InvoiceModel.findById(id)
                .populate('customer', 'name phonenumber')
                .populate('promoCode', 'name discount startTime endTime')
                .populate('employeeGetByUser', 'firstName lastName email')
                .populate({
                    path: 'invoiceDetails',
                    select: 'selectedSize quantity total',
                    populate: {
                        path: 'product',
                        select: 'name sizes',
                    },
                });

            if (!invoices) {
                return res.status(404).json({ message: 'Invoice not found' });
            }

            res.status(200).json(invoice);
        } catch (error) {
            console.error('Error retrieving invoice:', error);
            res.status(500).json({ message: 'Error retrieving invoice', error });
        }
    }
    //
    //Tạo hóa đơn và chi tiết hóa đơn
    async CreateInvoiceWithDetails(req, res) {
        const {
            customerPhone,
            userId,
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
            const user = await UserModel.findById(userId)
            if (!user) {
                return res.status(400).json({ message: 'User not found. Please check again.' });
            }

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
                employeeGetByUser: user._id,
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


    //Xác nhận hóa đơn 
    async completeInvoice(req, res) {
        const { id } = req.params;
        try {
            const updateInvoice = await InvoiceModel.findByIdAndUpdate(
                id,
                { status: 'Completed' },
                { new: true }
            );
            if (!updateInvoice) {
                return res.status(404).json({ message: 'Invoice not found' });
            }
            await updateInvoice.save()
            res.status(200).json({
                message: 'Invoice status updated to Completed successfully',
                data: updateInvoice,
            });
        } catch (error) {
            console.error('Error updating invoice status:', error);
            res.status(500).json({
                message: 'Error updating invoice status',
                error: error.message,
            });
        }
    }
    async cancelInvoice(req, res) {
        const { id } = req.params;

        try {
            const invoice = await InvoiceModel.findById(id)
                .populate({
                    path: 'invoiceDetails',
                    select: 'selectedSize quantity',
                    populate: {
                        path: 'product',
                        select: 'name',
                    },
                });
            for (const detail of invoice.invoiceDetails) {
                console.log(detail.product._id) // vô id trong tìm size cộng size lại
            }
            if (!invoice) {
                return res.status(404).json({ message: 'Invoice not found' });
            }

            // Trả về thông tin hóa đơn
            res.status(200).json({
                message: 'Invoice retrieved successfully',
                data: invoice,
            });
        } catch (error) {
            console.error('Error retrieving invoice:', error);
            res.status(500).json({ message: 'Error retrieving invoice', error });
        }
    }


}

module.exports = new InvoiceController();
