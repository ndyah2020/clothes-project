const Customer = require("../models/Customer");
const Employee = require("../models/Employee");
const Product = require("../models/Product");
const Invoice = require("../models/Invoice");
const Supplier = require("../models/Supplier");
const ImportNote = require("../models/ImportNote");
const Promotion = require("../models/Promotion");

class dashboard {
  // Lấy tất cả dữ liệu
  async getDatas(req, res) {
    try {
      // 1. Lấy danh sách khách hàng
      const customers = await Customer.find().lean();
      const totalCustomers = customers.length;

      // Tính tổng số lần mua và tổng tiền cho từng khách hàng
      const customersWithStats = await Promise.all(
        customers.map(async (customer) => {
          const customerInvoices = await Invoice.find({
            customer: customer._id,
          }).lean();
          const totalPurchases = customerInvoices.length;
          const totalRevenue = customerInvoices.reduce(
            (sum, inv) => sum + inv.totalPrice,
            0
          );

          return {
            ...customer,
            totalPurchases,
            totalRevenue,
          };
        })
      );

      // Lấy danh sách khách hàng VIP
      const vipCustomers = customersWithStats.sort((a, b) => b.point - a.point); // Sắp xếp theo số lần mua

      const topVipCustomers = vipCustomers.slice(0, 5); // Lấy top 5 khách hàng VIP

      console.log("TOP Khách Hàng VIP:", topVipCustomers); 

      // 2. Lấy danh sách nhân viên
      const employees = await Employee.find().lean();
      const totalEmployees = employees.length;

      // 3. Lấy danh sách sản phẩm
      const products = await Product.find().lean();
      const totalProducts = products.length;
      const lowStockProducts = products.filter((product) =>
        product.sizes.some((size) => size.quantity <= 10)
      );

      // 4. Lấy danh sách hóa đơn
      const invoices = await Invoice.find()
        .populate("customer", "name") // Lấy thông tin khách hàng liên quan
        .lean();
      const totalInvoices = invoices.length;
      const totalRevenue = invoices
        .filter((invoice) => invoice.status === "Completed")
        .reduce((sum, inv) => sum + inv.totalPrice, 0);

      // 5. Lấy danh sách nhà cung cấp
      const suppliers = await Supplier.find().lean();

      // Tính tổng tiền cung cấp cho từng nhà cung cấp
      const suppliersWithTotalSupplied = await Promise.all(
        suppliers.map(async (supplier) => {
          const supplierImportNotes = await ImportNote.find({
            supplierId: supplier._id,
          }).lean();
          const totalSupplied = supplierImportNotes.reduce(
            (sum, note) => sum + note.totalAmount,
            0
          );

          return {
            ...supplier,
            totalSupplied,
          };
        })
      );

      const totalSuppliers = suppliers.length;

      // 6. Lấy danh sách phiếu nhập
      const importNotes = await ImportNote.find()
        .populate("supplierId", "name") // Lấy thông tin nhà cung cấp liên quan
        .lean();
      const totalImportCost = importNotes.reduce(
        (sum, note) => sum + note.totalAmount,
        0
      );

      // 7. Lấy danh sách mã giảm giá
      const promotions = await Promotion.find().lean();
      const activePromotions = promotions.filter(
        (promo) => promo.status === "Active"
      );

      // 8. Phân tích trạng thái hóa đơn
      const invoiceStatusCount = {
        Completed: invoices.filter((inv) => inv.status === "Completed").length,
        Pending: invoices.filter((inv) => inv.status === "Pending").length,
        Cancelled: invoices.filter((inv) => inv.status === "Cancelled").length,
      };

      // Tổng hợp dữ liệu
      const dashboardData = {
        summary: {
          totalCustomers,
          totalEmployees,
          totalProducts,
          totalInvoices,
          totalRevenue,
          totalSuppliers,
          totalImportCost,
        },
        details: {
          customers: customersWithStats,
          vipCustomers: topVipCustomers,
          employees,
          products,
          lowStockProducts,
          invoices,
          suppliers: suppliersWithTotalSupplied,
          importNotes,
          promotions,
          activePromotions,
          invoiceStatusCount,
        },
      };

      // Trả dữ liệu về client
      return res.status(200).json({
        success: true,
        data: dashboardData,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch dashboard data",
        error: error.message,
      });
    }
  }
}

module.exports = new dashboard();
