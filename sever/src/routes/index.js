const userRouter = require("./user");
const productRouter = require("./product");
const supplier = require("./supplier")
function route(app) {
  app.use("/user", userRouter);
  app.use("/product", productRouter);
  app.use("/supplier", supplier )
}

module.exports = route;
