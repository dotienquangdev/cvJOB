const systemConfig = require("../../config/system");
const ProductCategory = require("../../models/product-category.model");
const createTreeHelper = require("../../helpers/createTree")
const mongoose = require("mongoose"); // 🛠 Thêm dòng này! 
// [GET] /admin/products-category  hiển thị danh mục
module.exports.index = async (req, res) => {

    let find = {
        deleted: false,
    };

    const records = await ProductCategory.find(find)
    const newRecords = createTreeHelper.tree(records);

    res.render("admin/pages/products-category/index", {
        pageTitle: "Danh mục sản phẩm",
        records: newRecords
    });
}
module.exports.create = async (req, res) => {
    let find = {
        deleted: false
    }
    const records = await ProductCategory.find(find);
    const newRecords = createTreeHelper.tree(records);
    // console.log(newRecords);
    // console.log(records);
    res.render("admin/pages/products-category/create", {
        pageTitle: "Tạo danh mục sản phẩm",
        records: newRecords
    });
}
// [POST] /admin/products-category/create tạo mới 1 sản phẩm
module.exports.createPost = async (req, res) => {
    if (req.body.position == "") {
        const count = await ProductCategory.count();
        req.body.position = count + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }
    const record = new ProductCategory(req.body);
    await record.save();
    // console.log(record);
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    console.log("Lưu thành công!");
}
module.exports.deleteItem = async (req, res) => {
    // console.log(req.params);
    const id = req.params.id;
    await ProductCategory.updateOne({ _id: id }, {
        deleted: true,
        deletedAt: new Date()
    });
    req.flash("success", `Đã xóa thành công  sản phẩm`);
    res.redirect(`back`);  // back là để cho nó dừng laị ở trang đó
}
// [DELETE] /admin/products/delete/:id Xóa cứng
// module.exports.deleteItem = async (req, res) => {
//     // console.log(req.params);
//     const id = req.params.id;
//     await Product.deleteOne({ _id: id });
//     req.flash("success", `Đã xóa thành công  sản phẩm`);
//     res.redirect(`back`);  // back là để cho nó dừng laị ở trang đó
// }
//[GET] edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        // console.log(id);

        const data = await ProductCategory.findOne({
            _id: id,
            deleted: false
        })
        // console.log(data);
        const records = await ProductCategory.find({
            deleted: false
        });
        const newRecords = createTreeHelper.tree(records);

        res.render("admin/pages/products-category/edit", {
            pageTitle: "Chỉnh sửa danh mục sản phẩm",
            data: data,
            records: newRecords
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products-category`)
    }
}
//[GET] edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;
    req.body.position = parseInt(req.body.position);
    await ProductCategory.updateOne({ _id: id }, req.body);
    res.redirect("back");
}
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id,
        };
        const record = await ProductCategory.findOne(find);
        if (!record) {
            req.flash("error", "Không tìm thấy tài khoản.");
            res.redirect(`${systemConfig.prefixAdmin}/products-category`);
        }
        res.render("admin/pages/products-category/detail.pug", {
            pageTitle: `Chi tiết tài khoản - ${record.email}`,
            record: record
        });
    } catch (error) {
        req.flash("error", "Đã xảy ra lỗi khi tải chi tiết tài khoản.");
        res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    }
};