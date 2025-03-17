const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const md5 = require("md5");
const systemConfig = require("../../config/system");

module.exports.index = async (req, res) => {
    res.render("admin/pages/my-account/index", {
        pageTitle: "Thông tin cá nhân",
    })
}

module.exports.edit = async (req, res) => {
    res.render("admin/pages/my-account/edit", {
        pageTitle: "Chỉnh sửa thông tin cá nhân",
    })
}

module.exports.editPatch = async (req, res) => {
    const id = res.locals.user.id;
    const emailExist = await Account.findOne({
        _id: { $ne: id }, // để ko tính tới cái đang sửa
        email: req.body.email,
        deleted: false
    })
    if (emailExist) {
        req.flash("error", `Email ${req.body.email} đã tồn tại.`);
    } else {
        if (req.body.password) {
            req.body.password = md5(req.body.password);
        } else {
            delete req.body.password;
        }

        await Account.updateOne({ _id: id }, req.body);

        req.flash("success", "Cap nhat thanh cong")
    }
    res.redirect("back");
}