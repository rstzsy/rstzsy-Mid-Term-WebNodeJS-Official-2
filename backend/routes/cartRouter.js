const express = require('express');
const router = express.Router();
const Cart = require('../modles/cart'); // Đường dẫn đến model Cart
const Product = require('../modles/product'); // Thêm dòng này nếu bạn đang sử dụng model Product


router.get('/add-to-cart', async (req, res) => {
    try {
        const { name, price, type, image } = req.query;

        if (!name || !price || !type || !image) {
            return res.status(400).send('Missing product information!');
        }

        // Tạo sản phẩm mới trong giỏ hàng
        const newCartItem = new Cart({
            name: decodeURIComponent(name),
            price: parseFloat(price),
            type: decodeURIComponent(type),
            image: decodeURIComponent(image),
        });

        await newCartItem.save();

        // Chuyển hướng về trang product
        res.redirect('/product'); // Đường dẫn đến trang product
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to add product to cart!');
    }
});

router.get('/product', async (req, res) => {
    try {
        const cartItems = await Cart.find(); // Lấy danh sách sản phẩm trong giỏ hàng
        const products = await Product.find(); // Lấy danh sách tất cả sản phẩm (hoặc thay thế bằng model khác)

        res.render('product', { cartItems, products }); // Truyền cả cartItems và products đến view
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to load products or cart!');
    }
});


router.post('/remove-item', async (req, res) => {
    try {
        const { productId } = req.body;
        if (!productId) {
            return res.status(400).send('Product ID is required!');
        }

        // Xóa sản phẩm khỏi giỏ hàng
        await Cart.findByIdAndDelete(productId);

        // Chuyển hướng lại trang sản phẩm hoặc giỏ hàng
        res.redirect('/product'); // Hoặc trang giỏ hàng nếu cần
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to remove item from cart!');
    }
});

router.get('/checkout', async (req, res) => {
    try {
        const cartItems = await Cart.find(); // Lấy danh sách sản phẩm trong giỏ hàng của người dùng
        let totalPrice = 0;

        // Tính tổng giá trị giỏ hàng
        cartItems.forEach(item => {
            totalPrice += item.price;
        });

        res.render('checkout', { cartItems, totalPrice }); // Truyền cartItems và totalPrice vào trang checkout
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to load checkout page!');
    }
});

// cartRouter.js
router.get('/confirm-order', async (req, res) => {
    try {
        // Tính toán tổng giá trị và xác nhận đơn hàng
        const cartItems = await Cart.find(); 
        const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);
        
        // Lưu thông tin đơn hàng hoặc thực hiện thanh toán

        res.render('order-confirmation', { cartItems, totalPrice }); // Chuyển đến trang xác nhận đơn hàng
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to confirm order!');
    }
});




module.exports = router;