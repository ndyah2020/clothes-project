const userRouter = require("./user");
const productRouter = require("./product");
const supplierRouter = require("./supplier"); 
const employeeRouter = require("./employee");
const customerRouter = require("./customer")
const royaltyDiscountRouter = require("./loyaltyDiscount")
const promotionRouter = require("./promotion")
const invoiceRouter = require("./invoice")
const importNodeRouter = require("./importNode")

function route(app) {
  app.use("/user", userRouter);
  app.use("/product", productRouter);
  app.use("/supplier", supplierRouter);
  app.use("/employee", employeeRouter);
  app.use("/customer", customerRouter)
  app.use("/loyalty-discount", royaltyDiscountRouter)
  app.use("/promotion", promotionRouter)
  app.use("/invoice",invoiceRouter)
  app.use("/import-note",importNodeRouter)
}

module.exports = route;
