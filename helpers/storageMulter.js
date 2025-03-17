const multer = require("multer");
// upload file lưu ảnh vào máy
module.exports = () => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "./public/uploads/");
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now();
            // + '-' + Math.round(Math.random() * 1E9)
            cb(null, `${uniqueSuffix}-${file.originalname}`);
            // cb(null, file.fieldname + '-' + uniqueSuffix)
        },
    });

    return storage;
}