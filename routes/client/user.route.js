const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/user.controllers.js");
const validate = require("../../validates/client/user.validate.js");
const authMiddleware = require("../../middlewares/client/auth.middlewares.js");
router.get("/register", controller.register);

router.post("/register",
    // validate.registerPost,
    controller.registerPost
);

router.get("/login", controller.login);
router.post("/login",
    validate.loginPost,
    controller.loginPost
);

//logout
router.get("/logout", controller.logout);

//lay lại mk
router.get("/password/forgot", controller.forgotPassword);
router.post("/password/forgot",
    validate.forgotPasswordPost,
    controller.forgotPasswordPost
);

router.get("/password/otp", controller.otpPassword);
router.post("/password/otp", controller.otpPasswordPost);

router.get("/password/reset", controller.resetPassword);

router.post(
    "/password/reset",
    validate.resetPasswordPost,
    controller.resetPasswordPost
);


router.get("/info",
    authMiddleware.requireAuth,
    controller.info
);


module.exports = router;