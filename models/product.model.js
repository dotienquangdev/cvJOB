// const { default: mongoose } = require("mongoose");
const mongoose = require("mongoose");
// npm i mongoose-slug-updater   // là khi người dùng chuyển trang thì tiêu đề localhib của trang web nó sẽ ăn theo chữ của sản phảm mà ko ăn theo id nữa
// npm i multer
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);
const productSchema = new mongoose.Schema(
    {
        title: String,
        description: String,
        price: Number,
        discountPercentage: Number,
        stock: Number,
        thumbnail: String,
        status: String,
        featured: String,
        position: Number,
        slug: {
            type: String,
            slug: "title",
            unique: true
        },
        // bai 22 tạo createdBy để lưu thông tin người tạo sửa
        createdBy: {
            account_id: String,
            createdAt: {
                type: Date,
                default: Date.now
            }
        },
        deleted: {
            type: Boolean,
            default: false
        },
        // deletedAt: Date,
        deletedBy: {
            account_id: String,
            deletedAt: Date
        },
        updatedBy: [
            {
                account_id: String,
                apdatedAt: Date,
            }
        ]
    },
    {
        timestamps: true
    }
);
const Product = mongoose.model('Product', productSchema, "product");
module.exports = Product;
// 1h34p