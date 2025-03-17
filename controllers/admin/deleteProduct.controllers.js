const Product = require("../../models/product.model");

const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
module.exports.deleteAll = async (req, res) => {
    // console.log(req.query.status);

    // Đoạn bộ lọc
    const filterStatus = filterStatusHelper(req.query);
    // console.log(filterStatus);

    let find = {
        deleted: true
    };

    if (req.query.status) {
        find.status = req.query.status;
    }
    //tính năng Tìm kiếm
    const objectSearch = searchHelper(req.query);
    // console.log(objectSearch);

    // let keyword = "";
    if (objectSearch.regex) {
        // keyword = req.query.keyword;
        // const regex = new RegExp(keyword, "i");
        find.title = objectSearch.regex;
    }

    // //Phân trang
    const countProducts = await Product.countDocuments(find);
    let objectPagination = paginationHelper({
        currentPage: 1,
        limitItems: 20
    },
        req.query,
        countProducts
    );

    const products = await Product.find(find).limit(objectPagination.limitItems).skip(objectPagination.skip);
    // console.log(objectPagination.skip);
    // .limit để lấy ra đúng 4 sản phẩm ở trang đó thôi
    // .skip là để bỏ qua các sản phẩm trước đó
    // console.log(products);
    //truyền re view
    res.render("admin/pages/deleteProducts/deleteProduct", {
        pageTitle: "Sản phẩm đã xóa",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword, // để trả về giao diện
        pagination: objectPagination
    });
}

// // [PATCH] /admin/products/change-status/:status/:id sửa từ hoạt động sang ko hoạt động và ngược lại
// module.exports.changeStatus = async (req, res) => {
//     // console.log(req.params);
//     const status = req.params.status;
//     const id = req.params.id;
//     await Product.updateOne({ _id: id }, { status: status });
//     // res.send(`${status} - ${id}`);
//     // res.redirect(`/admin/products`);  //redirect là để khi ấn từ dừng hoạt động sang Hoạt Động nó sẽ chuyển hướng về trang hiện tại
//     res.redirect(`back`);  // back là để cho nó dừng laị ở trang đó

// }
// [PATCH] /admin/products/change-multi
// module.exports.changeMulti = async (req, res) => {
//     // console.log(req.body);
//     const type = req.body.type;
//     const ids = req.body.ids.split(", ");
//     switch (type) {
//         case "active":
//             await Product.updateMany({ _id: { $in: ids } }, { status: "active" });
//             break;
//         case "inactive":
//             await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" });
//             break;
//         default:
//             break;
//     }

//     // console.log(type);
//     // console.log(ids);
//     res.redirect("back");
// }

// [DELETE] Xóa cứng
// module.exports.restoreAll = async (req, res) => {
//     // console.log(req.params);
//     const id = req.params.id;
//     await Product.deleteOne({ _id: id });
//     req.flash("success", `Sản phẩm đã được xóa vĩnh viễn.`);
//     res.redirect(`back`);  // back là để cho nó dừng laị ở trang đó
// }
module.exports.restoreAll = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await Product.deleteOne({ _id: id });

        if (result.deletedCount === 0) {
            req.flash("error", "Sản phẩm không tồn tại!");
            return res.redirect("back");
        }

        req.flash("success", "Sản phẩm đã được xóa vĩnh viễn.");
        res.redirect("back");
    } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
        req.flash("error", "Đã xảy ra lỗi khi xóa sản phẩm!");
        res.redirect("back");
    }
};


// [DELETE] Xóa mềm 
module.exports.restore = async (req, res) => {
    // console.log(req.params);
    const id = req.params.id;

    await Product.updateOne({ _id: id }, { deleted: false });
    req.flash("success", `Đã khôi phục thành công sản phẩm`);
    res.redirect(`back`);  // back là để cho nó dừng laị ở trang đó
}