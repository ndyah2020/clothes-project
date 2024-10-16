const categoryRouter = require("./category");
const userRouter = require("./user");

function route(app) {
  app.use("/category", categoryRouter);
  app.use("/user", userRouter);
}

module.exports = route;
