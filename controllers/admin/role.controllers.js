const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");
// [GET] /admin/dashboard
module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
    };
    const records = await Role.find(find);
    res.render("admin/pages/roles/index", {
        pageTitle: "Nhóm quyền",
        records: records
    });
}
//GET
module.exports.create = async (req, res) => {
    res.render("admin/pages/roles/create", {
        pageTitle: "Tạo mới nhóm quyền",
    });
}
//POST
module.exports.createPost = async (req, res) => {
    // console.log(req.body);

    const record = new Role(req.body);
    await record.save();
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
}
//get
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        let find = {
            _id: id,
            deleted: false
        }
        const data = await Role.findOne(find);
        // console.log(data);
        res.render("admin/pages/roles/edit", {
            pageTitle: "Sửa nhóm quyền",
            data: data
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }

}
//POST
module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id;
        await Role.updateOne({ _id: id }, req.body);
        req.flash("success", "Cập nhật các nhóm quyền thành công!");
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    } catch (error) {
        req.flash("success", "Cập nhật các nhóm quyền ko thành công!");
        // res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
    // res.redirect(`back`);
}
// [DELETE] Xóa mềm 
module.exports.deleteRoles = async (req, res) => {
    // console.log(req.params);
    const id = req.params.id;

    await Role.updateOne({ _id: id }, {
        deleted: true,
        deletedAt: new Date()
    });
    req.flash("success", `Đã xóa thành công  sản phẩm`);
    res.redirect(`back`);  // back là để cho nó dừng laị ở trang đó
}
//POST
module.exports.permissions = async (req, res) => {
    let find = {
        deleted: false,
    };
    const records = await Role.find(find);

    // console.log(records)
    res.render("admin/pages/roles/permissions", {
        pageTitle: "Phân quyền",
        records: records
    })
}
//patch
module.exports.permissionsPatch = async (req, res) => {
    // console.log(req.body.permissions);
    const permissions = JSON.parse(req.body.permissions);
    for (const item of permissions) {
        // const id = item.id;
        // const permissions = item.id;
        await Role.updateOne({ _id: item.id }, { permissions: item.permissions });
    }
    req.flash("success", "Cập nhật phân quyền thành công.");
    res.redirect("back");
}
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id,
        };
        const role = await Role.findOne(find);
        if (!role) {
            req.flash("error", "Không tìm thấy tài khoản.");
            res.redirect(`${systemConfig.prefixAdmin}/roles`);
        }

        res.render("admin/pages/roles/detail.pug", {
            pageTitle: `Chi tiết tài khoản - ${role.email}`,
            role: role
        });
    } catch (error) {
        req.flash("error", "Đã xảy ra lỗi khi tải chi tiết tài khoản.");
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
};