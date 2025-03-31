const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");

const productHelper = require("../../helpers/product");
const productCategoryHelper = require("../../helpers/product-category");
// [GET] /product
module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false
    }).sort({ position: "desc" });
    const newProducts = productHelper.priceNewProducts(products);

    // console.log(products);
    res.render("client/pages/products/index", {
        pageTitle: "Trang sản phẩm",
        products: newProducts
    });
}

// [GET] /product/detail
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            slug: req.params.slugProduct,
            status: "active"
        };
        const product = await Product.findOne(find);

        if (product.product_category_id) {
            const category = await ProductCategory.findOne({
                _id: product.product_category_id,
                status: "active",
                deleted: false,
            });
            product.category = category;
        }
        // console.log(product);
        product.priceNew = productHelper.priceNewProduct(product);
        res.render("client/pages/products/detail", {
            pageTitle: product.title,
            product: product
        });
    } catch (error) {
        // res.redirect(`${systemConfig.prefixAdmin}/products`);
        res.redirect(`/products`);
    }
}
module.exports.category = async (req, res) => {
    const category = await ProductCategory.findOne({
        slug: req.params.slugCategory,
        status: "active",
        deleted: false,
    });

    const listSubCategory = await productCategoryHelper.getSubCategory(category.id);
    const listSubCategoryId = listSubCategory.map(item => item.id);
    // 67b9a38df1507885e4fbcf60
    const products = await Product.find({
        product_category_id: { $in: [category.id, ...listSubCategoryId] },
        deleted: false,
    }).sort({ position: "desc" });
    const newProducts = productHelper.priceNewProducts(products);
    res.render("client/pages/products/index", {
        pageTitle: category.title,
        products: newProducts,
    });

};