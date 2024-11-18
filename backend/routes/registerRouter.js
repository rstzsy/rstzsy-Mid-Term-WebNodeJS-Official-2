const express = require('express');
const bodyParser = require('body-parser');
const User = require('../modles/user');
const bcrypt = require('bcryptjs'); // Import bcrypt
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

const session = require('express-session');

router.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', (req, res) => {
    res.render('register');
});

// Cấu hình Multer cho upload file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname);
    }
});

const upload = multer({
    storage: storage,
}).single('file');

router.post('/', upload, async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Hash mật khẩu trước khi lưu vào cơ sở dữ liệu
        const hashedPassword = await bcrypt.hash(password, 10); // 10 là số vòng lặp salt

        const user = new User({
            name,
            email,
            password: hashedPassword,
        });

        await user.save();

        req.session.message = {
            type: 'success',
            message: 'User added successfully!'
        };
        res.redirect("/login");
    } catch (err) {
        res.json({ message: err.message, type: 'danger' });
    }
});

module.exports = router;
