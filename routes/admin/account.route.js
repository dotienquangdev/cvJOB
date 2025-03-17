const express = require("express");
const multer = require("multer");
const router = express.Router();
const upload = multer(); // upload

const controller = require("../../controllers/admin/account.controllers");
const validate = require("../../validates/admin/account.validate.js");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middlewares.js");

router.get("/", controller.index);
router.get("/create", controller.create);

router.post(
    "/create",
    upload.single("avatar"),
    uploadCloud.upload,
    controller.createPost,
    validate.createPost
);
router.get("/edit/:id", controller.edit);

router.patch(
    "/edit/:id",
    upload.single("avatar"),
    uploadCloud.upload,
    controller.editPatch,
    validate.editPatch
);
router.delete("/delete/:id", controller.deleteAccount);
// Chi tiết sản phẩm
router.get("/detail/:id", controller.detail);
module.exports = router;