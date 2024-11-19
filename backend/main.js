require('dotenv').config();
const mongoose = require('mongoose');
const session = require('express-session');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

const loginRouter = require('./routes/loginRouter');
const registerRouter = require('./routes/registerRouter');
const productRouterAdmin = require('./routes/productRouter');
const adminRouter = require('./routes/adminRouter');
const cartRouter = require('./routes/cartRouter');
const Product = require('./modles/product');


app.use(express.static(path.join(__dirname, 'frontend/public'))); 
app.use(express.static(path.join(__dirname, 'frontend/public/uploads')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'frontend/views')); 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: 'your-secret-key', 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, 
  })
);


app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

app.use('/', cartRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/index', adminRouter);
app.use('/productRouterAdmin', productRouterAdmin);
app.use('/router', require('./routes/router'));
app.use('/router_product', require('./routes/router_product'));


app.get('/', (req, res) => {
  res.render('login');
});


app.get('/fail', (req, res) => {
  res.render('fail');
});

app.get('/homepageUser', (req, res) => {
  res.render('homepageUser');
});

app.get('/product', async (req, res) => {
  try {
    const products = await Product.find(); 
    res.render('product', { products: products }); 
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).send('Error fetching products');
  }
});

// Kết nối MongoDB
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', (error) => console.error('MongoDB connection error:', error));
db.once('open', () => console.log('Connected to the database'));


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Server is running at http://localhost:' + port);
});
