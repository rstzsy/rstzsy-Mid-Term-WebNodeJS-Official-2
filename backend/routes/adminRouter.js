const express = require('express');
const router = express.Router();
const User = require('../modles/user');
const Product = require('../modles/product');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

router.get('/addproduct', (req, res) => {
    res.render('add_product', { 
        HomePage: "Add Product", 
        message: req.session.message || null 
    });

    
    req.session.message = null;
});


// Image upload 
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'frontend/public/uploads');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname); 
    }
});

var upload = multer({
    storage: storage,
}).single("image");

// Insert a user


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
            const HomePage = 'My Awesome Website'; 
            const message = { type: 'success', message: 'Welcome!' }; 
            res.render('index', { HomePage, users, message });
        })
        .catch((err) => {
            res.json({ message: err.message });
        });
});



//edit user
router.get('/edit/:id', async (req, res) => {
    try {
        let id = req.params.id;
        const user = await User.findById(id); 

        if (!user) {
            return res.redirect('/');
        }

        
        const message = req.session.message || null; 
        res.render('edit_user', { HomePage: "Edit User", user: user, message: message });

        
        req.session.message = null;
        
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});





router.post('/update/:id', upload, async (req, res) => {
    let id = req.params.id;

    try {
        await User.findByIdAndUpdate(id, {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        });
        req.session.message = {
            type: 'success',
            message: 'User updated successfully!',
        };
        res.redirect('/index'); // Redirects to the home page
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

        req.session.message = {
            type: 'info',
            message: 'User deleted successfully!',
        };
        res.redirect('/index');
    } catch (err) {
        console.error("Error deleting user:", err);
        res.json({ message: err.message });
    }
});



// Insert a product
router.post('/addproduct', upload, (req, res) => { 
    if (!req.file) {  
        return res.json({ message: 'No file uploaded', type: 'danger' });
    }

    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        type: req.body.type,
        image: req.file.filename,  
    });

    product.save()
        .then(() => {
            req.session.message = {
                type: 'success',
                message: 'Product added successfully!'
            };
            res.redirect("products");  
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
                message: req.session.message || null,
            });
            req.session.message = null; 
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
        const product = await Product.findById(id); 

        if (!product) {
            return res.redirect('products');
        }

        res.render('edit_product', {
            HomePage: "Edit Product",
            product: product,
            message: req.session.message || null, 
        });

        req.session.message = null; 
    } catch (err) {
        console.error(err);
        res.redirect('products'); 
    }
});



router.post('/updateproduct/:id', upload, async (req, res) => {
    let id = req.params.id;
    let new_image = '';

    
    if (req.file) {
        new_image = req.file.filename;

        
        if (req.body.old_image) {
            const oldFilePath = path.join(__dirname, 'frontend/public/uploads', req.body.old_image);
            
            
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            } else {
                console.warn(`File không tồn tại: ${oldFilePath}`);
            }
        }
    } else {
        
        new_image = req.body.old_image;
    }

    
    let updatedData = {
        name: req.body.name,
        price: req.body.price,
        type: req.body.type,
        image: new_image
    };

    try {
        
        const result = await Product.findByIdAndUpdate(id, updatedData, { new: true });

        if (!result) {
            console.log("Product not found with ID:", id);
            return res.json({ message: "Product not found", type: "danger" });
        }

        req.session.message = {
            type: 'success',
            message: 'Product updated successfully!',
        };
        res.redirect('/index/products');
    } catch (err) {
        console.error("Error updating product:", err);
        res.json({ message: err.message, type: 'danger' });
    }
});



// Delete product
router.get('/deleteproduct/:id', async (req, res) => {
    let id = req.params.id;

    try {
        const result = await Product.findByIdAndDelete(id);

        if (result && result.image) {
            try {
                
                const filePath = path.join(__dirname, 'frontend/public/uploads', result.image);

                
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                } else {
                    console.warn(`File không tồn tại: ${filePath}`);
                }
            } catch (err) {
                console.error("Error deleting file:", err);
            }
        }

        req.session.message = {
            type: 'info',
            message: 'Product deleted successfully!',
        };
        res.redirect('/index/products');
    } catch (err) {
        console.error("Error deleting product:", err);
        res.json({ message: err.message });
    }
});



module.exports = router;
