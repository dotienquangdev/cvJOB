const dashboardRoutes = require("./dashboard.route");
const systemConfig = require("../../config/system.js");
const productRoutes = require("./product.route.js");
const deleteProductRoutes = require("./deleteProduct.router.js");
const productsCategoryRoutes = require("./product-category.router.js");
const roleRoutes = require("./role.route");
const accountRoutes = require("./account.route");
const authRoutes = require("./auth.route");
const authMiddleware = require("../../middlewares/admin/auth.middlewares");
const myAccountRoutes = require("./my-account.route.js");

module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;

    app.use(
        PATH_ADMIN + "/dashboard",
        authMiddleware.requireAuth,
        dashboardRoutes
    );
    app.use(
        PATH_ADMIN + "/products",
        authMiddleware.requireAuth,
        productRoutes
    );
    app.use(PATH_ADMIN + "/deleteProducts", authMiddleware.requireAuth, deleteProductRoutes);
    app.use(PATH_ADMIN + "/products-category", authMiddleware.requireAuth, productsCategoryRoutes);
    app.use(PATH_ADMIN + "/roles", authMiddleware.requireAuth, roleRoutes);
    app.use(PATH_ADMIN + "/accounts", authMiddleware.requireAuth, accountRoutes);
    app.use(PATH_ADMIN + "/auth", authRoutes);
    app.use(PATH_ADMIN + "/my-account", authMiddleware.requireAuth, myAccountRoutes);
}