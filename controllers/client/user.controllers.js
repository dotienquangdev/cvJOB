const User = require("../../models/user.model");
const Cart = require("../../models/cart.model");
const md5 = require("md5");
const generateHelper = require("../../helpers/generate");
const sendMailHelper = require("../../helpers/sendMail");
const ForgotPassword = require("../../models/forgot-password.model")

// get /search
module.exports.register = async (req, res) => {
    res.render("client/pages/user/register", {
        pageTitle: "Đăng ký tài khoản",
    });
}

// get /search
module.exports.registerPost = async (req, res) => {
    const existEmail = await User.findOne({
        email: req.body.email,
    });

    if (existEmail) {
        req.flash("error", "Email đẫ tồn tại!");
        res.redirect("back");
        return;
    };
    // console.log(req.body);

    req.body.password = md5(req.body.password);
    const user = new User(req.body);
    await user.save();
    // console.log(user);
    res.cookie("tokenUser", user.tokenUser);
    res.redirect("/user/login");
};

module.exports.login = async (req, res) => {
    res.render("client/pages/user/login", {
        pageTitle: "Đăng nhập tài khoản",
    });
}
// get /search
module.exports.loginPost = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({
        email: email,
        deleted: false,
    });

    if (!user) {
        req.flash("error", "Email không tồn tại");
        res.redirect("back");
        return;
    }
    if (md5(password) !== user.password) {
        req.flash("error", "Sai mật khẩu");
        res.redirect("back");
        return;
    }
    if (user.status === "inactive") {
        req.flash("error", "Tài khoản đã bị khóa!");
        res.redirect("back");
        return;
    }
    const cart = await Cart.findOne({
        user_id: user.id,
    });
    if (cart) {
        res.cookie("cartId", cart.id);
    } else {
        await Cart.updateOne({
            _id: req.cookies.cartId
        }, {
            user_id: user.id,
        })
    }
    res.cookie("tokenUser", user.tokenUser);

    await User.updateOne({
        tokenUser: user.tokenUser,
    }, {
        statusOnline: "online",
    })

    _io.once('connection', (socket) => {
        socket.broadcast.emit("SERVER_RETURN_USER_STATUS_ONLINE", {
            userId: user.id,
            status: "online",
        });
    });

    res.redirect("/");
};

module.exports.logout = async (req, res) => {
    await User.updateOne({
        tokenUser: req.cookies.tokenUser,
    }, {
        statusOnline: "offline",
    });

    _io.once('connection', (socket) => {
        socket.broadcast.emit("SERVER_RETURN_USER_STATUS_ONLINE", {
            userId: res.locals.user.id,
            status: "offline",
        });
    });
    // console.log()
    res.clearCookie("tokenUser");
    res.clearCookie("cartId");
    res.redirect("/user/login");
}

module.exports.forgotPassword = async (req, res) => {
    res.render("client/pages/user/forgot-password", {
        pageTitle: "Lấy lại mật khẩu",
    });
}

module.exports.forgotPasswordPost = async (req, res) => {
    const email = req.body.email;
    const user = await User.findOne({
        email: email,
        deleted: false,
    })
    if (!user) {
        res.flash("error", "Email đã tồn tại!");
        res.redirect("back");
        return;
    }
    const otp = generateHelper.generateRandomNumber(6);
    //Luu thong tin vaop database
    const objectForgotPassword = {
        email: email,
        otp: otp,
        expiresAt: Date.now(),
    }
    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();

    // console.log("Gửi mã OTP qua email : ", otp);
    const subject = "Mã OTP xác minh lấy lại mật khẩu";

    const html = `
        Mã OTP để lấy lại mật khẩu là <b style="color:green">${otp}</b>. Thời hạn sử dụng là 3 phút.
    `;

    sendMailHelper.sendMail(email, subject, html);

    res.redirect(`/user/password/otp?email=${email}`);
}

module.exports.otpPassword = async (req, res) => {
    const email = req.query.email;
    res.render("client/pages/user/otp-password", {
        pageTitle: "Nhập mã OTP",
        email: email,
    });
};

module.exports.otpPasswordPost = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;
    // console.log(email);
    // console.log(otp);
    const result = await ForgotPassword.findOne({
        email: email,
        otp: otp,
    })
    if (!result) {
        req.flash("error", "OTP không hợp lệ!");
        res.redirect("back");
        return;
    }
    const user = await User.findOne({
        email: email,
    });

    res.cookie("tokenUser", user.tokenUser);
    res.redirect("/user/password/reset");
};

module.exports.resetPassword = async (req, res) => {
    res.render("client/pages/user/reset-password", {
        pageTitle: "Đổi mật khẩu",
    });
};

module.exports.resetPasswordPost = async (req, res) => {
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const tokenUser = req.cookies.tokenUser;


    // console.log(password);
    // console.log(confirmPassword);
    // console.log(tokenUser);

    await User.updateOne({
        tokenUser: tokenUser,
    }, {
        password: md5(password),
    });

    res.redirect("/user/login");
};

module.exports.info = async (req, res) => {
    // const tokenUser = req.cookies.tokenUser;
    // const infoUser = await User.findOne({
    //     tokenUser: tokenUser,
    // }).select("-password");
    // // });
    // console.log(infoUser);
    res.render("client/pages/user/info", {
        pageTitle: "Thông tin tài khoản ",
        // infoUser: infoUser,
    })
};

// 1h36p