const express = require("express");
const multer = require("multer");
const router = express.Router();
const upload = multer(); // upload
// const storageMulter = require("../../helpers/storageMulter.js");
// const storageMulter = require("../../helpers/storageMulter.js");
// const upload = multer({ storage: storageMulter() }); // upload
// const upload = multer({ dest: "./public/uploads/" });
const controller = require("../../controllers/admin/product.controllers.js");
const validate = require("../../validates/admin/product.validate.js");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middlewares.js");

router.get("/", controller.index);
router.patch("/change-status/:status/:id", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

// xóa sản phẩm
router.delete("/delete/:id", controller.deleteItem);

// thêm mới sản phẩm
router.get("/create", controller.create);

router.post(
    "/create",
    upload.single("thumbnail"),
    uploadCloud.upload,  /// upload onlie len  sever
    validate.createPost,
    controller.createPost
);
// sửa sản phẩm
router.get("/edit/:id", controller.edit);

router.patch(
    "/edit/:id",
    upload.single("thumbnail"),
    uploadCloud.upload, /// upload onlie len  sever
    validate.createPost,
    controller.editPatch
);
// router.delete("/delete/:id", controller.deleteItem);

// Chi tiết sản phẩm
router.get("/detail/:id", controller.detail);

module.exports = router;
