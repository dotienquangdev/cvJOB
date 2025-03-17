const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const md5 = require("md5");
const systemConfig = require("../../config/system");
// [GET] /admin/dashboard

module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
    };
    const records = await Account.find(find).select("-password -token");
    // console.log(records);
    for (const record of records) {
        const role = await Role.findOne({
            // _id: record.role_id,
            deleted: false
        });
        record.role = role;
    }
    res.render("admin/pages/accounts/index", {
        pageTitle: "Danh sách tài khoản",
        records: records
    });
}

module.exports.create = async (req, res) => {
    const roles = await Role.find({
        deleted: false
    })
    res.render("admin/pages/accounts/create", {
        pageTitle: "Tạo mới tài khoản",
        roles: roles
    });
}

module.exports.createPost = async (req, res) => {
    const emailExist = await Account.findOne({
        email: req.body.email,
        deleted: false
    })

    // console.log(emailExist);
    if (emailExist) {
        req.flash("error", `Email ${req.body.email} đã tồn tại.`);
        res.redirect("back");
    } else {

        req.body.password = md5(req.body.password);
        const record = new Account(req.body);
        await record.save();

        res.redirect(`${systemConfig.prefixAdmin}/accounts`)
    }
}

module.exports.edit = async (req, res) => {
    let find = {
        _id: req.params.id,
        deleted: false
    };

    try {
        const data = await Account.findOne(find);
        const roles = await Role.find({
            deleted: false,
        });
        res.render("admin/pages/accounts/edit", {
            pageTitle: "Chỉnh sửa tài khoản",
            data: data,
            roles: roles,
        });
    } catch (error) {
        res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
    }
};

module.exports.editPatch = async (req, res) => {
    const id = req.params.id;
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
        // console.log(req.body)
        // res.render("error", "Cap nhat that bai")
        req.flash("success", "Cap nhat thanh cong")
    }
    res.redirect("back");

}

// [DELETE] Xóa mềm 
module.exports.deleteAccount = async (req, res) => {
    // console.log(req.params);
    const id = req.params.id;
    await Account.updateOne({ _id: id }, {
        deleted: true,
        deletedAt: new Date()
    });
    req.flash("success", `Đã xóa thành công  sản phẩm`);
    res.redirect(`back`);  // back là để cho nó dừng laị ở trang đó
}

// [GET] /admin/products/edit:id sửa 1 sản phẩm
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id,  // Cần tìm theo ID
        };
        const account = await Account.findOne(find);

        // Nếu không tìm thấy tài khoản, trả về trang danh sách
        if (!account) {
            req.flash("error", "Không tìm thấy tài khoản.");
            return res.redirect(`${systemConfig.prefixAdmin}/accounts`);
        }

        res.render("admin/pages/accounts/detail.pug", {
            pageTitle: `Chi tiết tài khoản - ${account.email}`,
            account: account
        });
    } catch (error) {
        console.error(error);  // Log lỗi để debug
        req.flash("error", "Đã xảy ra lỗi khi tải chi tiết tài khoản.");
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
};
