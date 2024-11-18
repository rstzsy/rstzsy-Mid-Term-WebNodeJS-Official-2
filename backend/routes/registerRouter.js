const express = require('express');
const bodyParser = require('body-parser');
const User = require('../modles/user'); // Lưu ý sửa lại 'modles' thành 'models' nếu sai
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router(); // Sử dụng `router` thay vì `app`

const session = require('express-session');

router.use(session({
    secret: 'your-secret-key', // Thay bằng chuỗi bí mật
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Đặt `true` nếu dùng HTTPS
}));


// Middleware
router.use(bodyParser.urlencoded({ extended: true }));

// Route GET
router.get('/', (req, res) => {
    res.render('register');
});

// Cấu hình Multer cho upload file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads'); // Thư mục lưu ảnh
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname); // Đặt tên file theo thời gian
    }
});

const upload = multer({
    storage: storage,
}).single('file'); // Xử lý một file với key là `file` trong request

// Route POST
router.post('/', upload, (req, res) => {

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    });

    user.save()
        .then(() => {
            req.session.message = {
                type: 'success',
                message: 'User added successfully!'
            };
            console.log(req.session.message);
            res.redirect("/login");
        })
        .catch((err) => {
            res.json({ message: err.message, type: 'danger' });
        });
});

// Export router
module.exports = router;
