const express = require('express');
const bodyParser = require('body-parser');
const User = require('../modles/user'); // Đảm bảo đường dẫn đúng tới model User
const bcrypt = require('bcryptjs'); // Import bcryptjs

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));

// Route GET để hiển thị trang login
router.get('/', (req, res) => {
    res.render('login', { errorMessage: null, email: '' });
});

// Route POST để xử lý đăng nhập
router.post('/', async (req, res) => {
    const { email, pass } = req.body;
    let errorMessage = '';

    try {
        // Kiểm tra dữ liệu đầu vào
        if (!email) {
            errorMessage = 'Please enter your email';
        } else if (!pass) {
            errorMessage = 'Please enter your password';
        } else if (!email.includes("@")) {
            errorMessage = 'Invalid email format';
        }

        if (errorMessage) {
            return res.render('login', { errorMessage, email });
        }

        // Trường hợp đặc biệt: Admin
        if (email === 'admin@gmail.com' && pass === '123456') {
            // Lưu trạng thái đăng nhập admin vào session (nếu cần)
            req.session.user = { role: 'admin', email };
            return res.redirect('/index'); // Chuyển hướng đến trang admin
        }

        // Tìm người dùng trong cơ sở dữ liệu
        const user = await User.findOne({ email });

        if (!user) {
            errorMessage = 'Invalid email or password';
            return res.render('login', { errorMessage, email });
        }

        // So sánh mật khẩu đã mã hóa
        const match = await bcrypt.compare(pass, user.password);

        if (!match) {
            errorMessage = 'Invalid email or password';
            return res.render('login', { errorMessage, email });
        }

        // Thành công: Lưu trạng thái user vào session
        req.session.user = { role: 'user', email: user.email };

        // Chuyển hướng đến trang người dùng
        res.redirect('/homepageUser');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while logging in.');
    }
});

module.exports = router;
