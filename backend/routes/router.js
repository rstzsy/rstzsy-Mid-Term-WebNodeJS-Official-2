const express = require('express');
const router = express.Router();
const User = require('../modles/user');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Image upload 
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/uploads'); // Thư mục lưu ảnh
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname); // Sử dụng `Date.now()` và `file.originalname`
    }
});

var upload = multer({
    storage: storage,
}).single("image");

// Insert a user
router.post('/add', upload, (req, res) => { 
    if (!req.file) {  
        return res.json({ message: 'No file uploaded', type: 'danger' });
    }

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: req.file.filename,  
    });

    user.save()
        .then(() => {
            req.session.message = {
                type: 'success',
                message: 'User added successfully!'
            };
            console.log(req.session.message); 
            res.redirect("/");
        })
        .catch((err) => {
            res.json({ message: err.message, type: 'danger' });
        });
});

//     user.save((err)=>{
//         if(err){
//             res.json({message: err.message,type:'danger'})
//         }else{
//             req.session.message ={
//                 type:'success',
//                 message:'User added successfully!'
//             }
//             res.redirect("/")
//         }
//     })

router.get('/', (req, res) => {
    User.find().exec()
        .then((users) => {
            res.render('index', {
                HomePage: 'Home Page',
                users: users,
            });
        })
        .catch((err) => {
            res.json({ message: err.message });
        });
});


router.get('/add', (req, res) => {
    res.render('add_users', { HomePage: "Add Users" });
});

//edit user
router.get('/edit/:id', async (req, res) => {
    try {
        let id = req.params.id;
        const user = await User.findById(id); // Sử dụng `await` để đợi kết quả

        if (!user) {
            return res.redirect('/'); // Nếu không tìm thấy user, chuyển hướng về trang chủ
        }

        res.render('edit_user', {
            HomePage: "Edit User",
            user: user,
        });
    } catch (err) {
        console.error(err);
        res.redirect('/'); // Nếu có lỗi, chuyển hướng về trang chủ
    }
});


router.post('/update/:id', upload, async (req, res) => {
    let id = req.params.id;
    let new_image = '';

    if (req.file) {
        new_image = req.file.filename;
        try {
            fs.unlinkSync('./uploads/' + req.body.old_image);
        } catch (err) {
            console.log(err);
        }
    } else {
        new_image = req.body.old_image;
    }

    try {
        await User.findByIdAndUpdate(id, {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: new_image,
        });
        req.session.message = {
            type: 'success',
            message: 'User updated successfully!',
        };
        res.redirect('/'); // Redirects to the home page
    } catch (err) {
        console.error(err);
        res.json({ message: err.message, type: 'danger' });
    }
});

//Delete user
router.get('/delete/:id', async (req, res) => {
    let id = req.params.id;

    try {
        const result = await User.findByIdAndDelete(id);

        if (result && result.image) {
            try {
                fs.unlinkSync('./uploads/' + result.image);
            } catch (err) {
                console.error("Error deleting file:", err);
            }
        }

        req.session.message = {
            type: 'info',
            message: 'User deleted successfully!',
        };
        res.redirect('/');
    } catch (err) {
        console.error("Error deleting user:", err);
        res.json({ message: err.message });
    }
});



module.exports = router;
