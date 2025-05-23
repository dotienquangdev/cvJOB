const ProductCategory = require("../../models/product-category.model");
const createTreeHelper = require("../../helpers/createTree")

module.exports.category = async (req, res, next) => {

    const productsCategory = await ProductCategory.find({
        deleted: false,
    })
    const newProductCategory = createTreeHelper.tree(productsCategory);

    res.locals.layoutProductCategory = newProductCategory;
    next();
}