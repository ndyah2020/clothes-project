const userRouter = require("./user");
const productRouter = require("./product");
const supplierRouter = require("./supplier"); 
const employeeRouter = require("./employee");
const customerRouter = require("./customer")
function route(app) {
  app.use("/user", userRouter);
  app.use("/product", productRouter);
  app.use("/supplier", supplierRouter);
  app.use("/employee", employeeRouter);
  app.use("/customer", customerRouter)
}

module.exports = route;
