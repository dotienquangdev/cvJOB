const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/deleteProduct.controllers.js");

router.get("/", controller.deleteAll);
// router.patch("/change-status/:status/:id", controller.changeStatus);

// router.patch("/change-multi", controller.changeMulti);

router.delete("/delete/:id", controller.restore);

router.delete("/deleteAll/:id", controller.restoreAll);

// router.delete("/delete/:id", controller.deleteItem);
module.exports = router;