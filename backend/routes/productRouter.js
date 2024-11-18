const express = require('express');
const router = express.Router();
const Product = require('../modles/product');
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

// Insert a product
router.post('/addproduct', upload, (req, res) => { 
    if (!req.file) {  
        return res.json({ message: 'No file uploaded', type: 'danger' });
    }

    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        image: req.file.filename,  
    });

    product.save()
        .then(() => {
            req.session.message = {
                type: 'success',
                message: 'Product added successfully!'
            };
            res.redirect("/products");  // Chuyển hướng đến danh sách sản phẩm sau khi thêm thành công
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

router.get('/products', (req, res) => {
    Product.find().exec()
        .then((products) => {
            res.render('products', {
                HomePage: 'Products List',
                products: products,
            });
        })
        .catch((err) => {
            res.json({ message: err.message });
        });
});


router.get('/addproduct', (req, res) => {
    res.render('add_product', { HomePage: "Add Product" });
});


//edit product
router.get('/editproduct/:id', async (req, res) => {
    try {
        let id = req.params.id;
        const product = await Product.findById(id); // Sử dụng `await` để đợi kết quả

        if (!product) {
            return res.redirect('/products'); // Nếu không tìm thấy user, chuyển hướng về trang chủ
        }

        res.render('edit_product', {
            HomePage: "Edit Product",
            product: product,
        });
    } catch (err) {
        console.error(err);
        res.redirect('/products'); // Nếu có lỗi, chuyển hướng về trang chủ
    }
});


router.post('/updateproduct/:id', upload, async (req, res) => {
    let id = req.params.id;
    let new_image = '';

    // Kiểm tra xem có file mới được upload hay không
    if (req.file) {
        new_image = req.file.filename;

        // Xóa ảnh cũ nếu có
        try {
            if (req.body.old_image) {
                fs.unlinkSync('./public/uploads/' + req.body.old_image);
            }
        } catch (err) {
            console.log("Error deleting old image:", err);
        }
    } else {
        // Nếu không có file mới, giữ lại ảnh cũ
        new_image = req.body.old_image;
    }

    // Tạo dữ liệu cập nhật
    let updatedData = {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        image: new_image // Sử dụng `new_image` đã được xử lý ở trên
    };

    try {
        // Log dữ liệu cập nhật để kiểm tra
        console.log("Updating product with ID:", id);
        console.log("req.body.name:", req.body.name);
        console.log("req.body.price:", req.body.price);
        console.log("req.body.description:", req.body.description);
        console.log("req.body.old_image:", req.body.old_image);
        console.log("Updated data before save:", updatedData);
    
        // Cập nhật sản phẩm trong cơ sở dữ liệu
        const result = await Product.findByIdAndUpdate(id, updatedData, { new: true });
        
        if (!result) {
            console.log("No product found with this ID.");
            return res.json({ message: "Product not found", type: "danger" });
        }
        
        // Thiết lập thông báo thành công
        req.session.message = {
            type: 'success',
            message: 'Product updated successfully!',
        };
        
        // Chuyển hướng đến trang danh sách sản phẩm
        res.redirect('/products');
    } catch (err) {
        console.error("Error updating product:", err);
        res.json({ message: err.message, type: 'danger' });
    }
});

//Delete product
router.get('/deleteproduct/:id', async (req, res) => {
    let id = req.params.id;

    try {
        const result = await Product.findByIdAndDelete(id);

        if (result && result.image) {
            try {
                fs.unlinkSync('./uploads/' + result.image);
            } catch (err) {
                console.error("Error deleting file:", err);
            }
        }

        req.session.message = {
            type: 'info',
            message: 'Product deleted successfully!',
        };
        res.redirect('/products');
    } catch (err) {
        console.error("Error deleting product:", err);
        res.json({ message: err.message });
    }
});



module.exports = router;
