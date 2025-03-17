const categoryMiddleware = require("../../middlewares/client/category.middleware.js");
const productRouter = require("./product.route.js");
const homeRoutes = require("./home.router.js");
module.exports = (app) => {

    app.use(categoryMiddleware.category)

    // app.use("/", categoryMiddleware.category, homeRoutes);
    // app.use("/products", categoryMiddleware.category, productRouter)
    app.use("/", homeRoutes);
    app.use("/products", productRouter)

}