const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/auth.controllers");
const validate = require("../../validates/admin/auth.validate.js");

router.get("/login", controller.login);
router.post(
    "/login",
    controller.loginPost,
    validate.loginPost
);
router.get("/logout", controller.logout);


module.exports = router;