const categoryRouter = require("./category");
const userRouter = require("./user");
const supplierRouter = require('./supplier')
function route(app) {
  app.use("/category", categoryRouter);
  app.use("/user", userRouter);
  app.use("/supplier", supplierRouter)
}

module.exports = route;
