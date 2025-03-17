const md5 = require("md5");
const systemConfig = require("../../config/system");
const Account = require("../../models/account.model");

// [GET] /admin/login
module.exports.login = (req, res) => {
    console.log(req.cookies.token);
    if (req.cookies.token) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    } else {
        res.render("admin/pages/auth/login", {
            pageTitle: "Đăng nhập"
        });
    }
}

module.exports.logout = (req, res) => {
    res.clearCookie("token");
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
}

// module.exports.loginPost = async (req, res) => {
//     const email = req.body.email;
//     const password = req.body.password;
//     const user = await Account.findOne({
//         email: email,
//         deleted: false,
//     })
//     if (!user) {
//         req.flash("error", "Email khong ton tai");
//         res.redirect("back");
//         return;
//     }
//     if (md5(password) != user.password) {
//         req.flash("error", "Sai mat khau");
//         res.redirect("back");
//         return;
//     }
//     if (user.status == "inactive") {
//         req.flash("error", "Tai khoan bi khoa");
//         res.redirect("back");
//         return;
//     }
//     res.cookie("token", user.token);
//     res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
// }
module.exports.loginPost = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = await Account.findOne({
        email: email,
        deleted: false,
    });

    if (!user) {
        req.flash("error", "Email không tồn tại");
        res.redirect(req.get("Referrer") || "/");
        return;
    }

    if (md5(password) !== user.password) {
        req.flash("error", "Sai mật khẩu");
        res.redirect(req.get("Referrer") || "/");
        return;
    }

    if (user.status === "inactive") {
        req.flash("error", "Tài khoản bị khóa");
        res.redirect(req.get("Referrer") || "/");
        return;
    }

    res.cookie("token", user.token);
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
};
