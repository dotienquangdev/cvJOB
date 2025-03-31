const Product = require("../../models/product.model");
const Cart = require("../../models/cart.model");

const productsHelper = require("../../helpers/product");
const { default: mongoose } = require("mongoose");
// GET /cart
module.exports.index = async (req, res) => {
    const cartId = req.cookies.cartId;
    const cart = await Cart.findOne({
        _id: new mongoose.Types.ObjectId(cartId)
    })
    if (cart.products.length > 0) {
        for (const item of cart.products) {
            const productId = item.product_id;
            const productInfo = await Product.findOne({
                _id: productId,

            }).select("title thumbnail slug price discountPercentage");
            productInfo.priceNew = productsHelper.priceNewProduct(productInfo);
            item.productInfo = productInfo;
            item.totalPrice = productInfo.priceNew * item.quantity;
        }
    }
    cart.totalPrice = cart.products.reduce((sum, item) =>
        sum + item.totalPrice, 0);
    // console.log(cart);
    res.render("client/pages/cart/index", {
        pageTitle: "Giỏ hàng",
        cartDetail: cart,
    });
}

// [POST] /cart/add/:productId
module.exports.addPost = async (req, res) => {
    const productId = req.params.productId;
    const quantity = parseInt(req.body.quantity);
    const cartId = req.cookies.cartId;
    const cart = await Cart.findOne(
        {
            _id: cartId,
        },
    )
    const exitsProductInCart = cart.products.find(item => item.product_id == productId);
    if (exitsProductInCart) {
        const quantityNew = quantity + exitsProductInCart.quantity;
        await Cart.updateOne({
            _id: cartId,
            "products.product_id": productId,
        }, {
            $set: {
                "products.$.quantity": quantityNew,
            }
        });
    } else {
        const objectCart = {
            product_id: productId,
            quantity: quantity,
        }
        await Cart.updateOne(
            {
                _id: cartId,
            },
            {
                $push: { products: objectCart }
            }
        )
    }
    req.flash("success", "Đã thêm sản phẩm vào giỏ hàng!");
    res.redirect("back");

}
//delete
module.exports.delete = async (req, res) => {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    await Cart.updateOne({
        _id: cartId,
    }, {
        $pull: { products: { product_id: productId } }
    });
    // const cart = await Cart.findById(cartId);
    // const indexProduct = cart.products.findIndex(dataIndex => dataIndex.product_id === productId);
    // cart.products.splice(indexProduct, 1);
    // await cart.save();
    req.flash("success", "Đã xóa dản phẩm khỏi giỏ hàng!");
    res.redirect("back");
}
//update
module.exports.update = async (req, res) => {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    const quantity = req.params.quantity;
    // console.log(req.params);
    await Cart.updateOne(
        {
            _id: cartId,
            "products.product_id": productId,
        },
        {
            $set: {
                "products.$.quantity": quantity,
            }
        }
    );
    req.flash("success", "Cập nhật số lượng thành công!");
    res.redirect("back");
}