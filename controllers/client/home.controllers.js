const Product = require("../../models/product.model");
const productHelper = require("../../helpers/product");
// [GET] /a
module.exports.index = async (req, res) => {
    //Lấy ra sản phẩm nổi bật
    const productsFeatured = await Product.find({
        featured: "1",
        deleted: false,
        status: "active",
    });

    const newProducts = productHelper.priceNewProducts(productsFeatured);

    const productsNew = await Product.find({
        deleted: false,
        status: "active",
    }).sort({ position: "desc" });

    res.render("client/pages/home/index", {
        pageTitle: "Trang chủ",
        productsFeatured: newProducts,
        productsNew: productsNew
    });
}