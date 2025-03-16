/**
 * Indian Grocery Mart - Backend Server
 * This file handles all the backend operations including:
 * - Database connections
 * - API endpoints for products, orders, and reviews
 * - Data models and schemas
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const moment = require('moment-timezone');
const multer = require('multer');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

// MongoDB Connection with better error handling
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/martdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
}).then(() => {
  console.log('Connected to MongoDB successfully');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

// Monitor MongoDB connection
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed through app termination');
  process.exit(0);
});

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'client/public/images/products')
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '-' + file.originalname)
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload an image.'), false);
    }
  }
});

// Serve static files from the public directory
app.use('/images', express.static(path.join(__dirname, 'client/public/images')));

// Error handling middleware - move to top level
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com', // Replace with your email
    pass: process.env.EMAIL_PASS || 'your-app-password'     // Replace with your app password
  }
});

// Function to send order notification email
async function sendOrderNotification(order) {
  const itemsList = order.items.map(item => 
    `${item.itemName} - Quantity: ${item.quantity} - Price: ₹${item.totalPrice}`
  ).join('\n');

  // Different email content for owner and customer
  const ownerEmailContent = `
    New Order Received!
    
    Order Details:
    Customer Name: ${order.userName}
    Mobile: ${order.userMobile}
    Order Date: ${moment(order.orderDate).format('MMMM Do YYYY, h:mm:ss a')}
    
    Items:
    ${itemsList}
    
    Grand Total: ₹${order.grandTotal}
  `;

  const customerEmailHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
        }
        .header {
          background-color: #2e7d32;
          color: white;
          padding: 20px;
          text-align: center;
        }
        .content {
          padding: 20px;
        }
        .order-summary {
          background-color: #f5f5f5;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        .items-table th, .items-table td {
          padding: 10px;
          border-bottom: 1px solid #ddd;
          text-align: left;
        }
        .items-table th {
          background-color: #f5f5f5;
        }
        .total {
          font-size: 18px;
          font-weight: bold;
          text-align: right;
          margin-top: 20px;
        }
        .contact {
          background-color: #f5f5f5;
          padding: 15px;
          border-radius: 5px;
          margin-top: 20px;
        }
        .footer {
          text-align: center;
          padding: 20px;
          color: #666;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Order Confirmation</h1>
        <p>Thank you for shopping at Sunil's Mart!</p>
      </div>
      
      <div class="content">
        <p>Dear ${order.userName},</p>
        <p>We're delighted to confirm that we've received your order.</p>
        
        <div class="order-summary">
          <h2>📦 Order Summary</h2>
          <p><strong>Order Date:</strong> ${moment(order.orderDate).format('MMMM Do YYYY, h:mm:ss a')}</p>
          <p><strong>Customer Name:</strong> ${order.userName}</p>
          <p><strong>Mobile Number:</strong> ${order.userMobile}</p>
        </div>

        <h2>🛒 Items Ordered</h2>
        <table class="items-table">
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
          ${order.items.map(item => `
            <tr>
              <td>${item.itemName}</td>
              <td>${item.quantity}</td>
              <td>₹${item.unitPrice}</td>
              <td>₹${item.totalPrice}</td>
            </tr>
          `).join('')}
        </table>

        <div class="total">
          Grand Total: ₹${order.grandTotal}
        </div>

        <div class="contact">
          <h2>📞 Need Help?</h2>
          <p>We're here to assist you:</p>
          <ul>
            <li>Phone: +91 6300345385</li>
            <li>Email: pidamarthisunilkumar162@gmail.com</li>
            <li>Address: Aziz Nagar, VJIT, Hyderabad.</li>
          </ul>
        </div>
      </div>

      <div class="footer">
        <p>Thank you for choosing Sunil's Mart! We appreciate your business.</p>
        <p>This is an automated email. Please do not reply to this message.</p>
      </div>
    </body>
    </html>
  `;

  try {
    // Send email to owner
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Order from ${order.userName}`,
      text: ownerEmailContent
    });

    // Send email to customer
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: order.userEmail,
      subject: 'Your Order Confirmation - Sunil\'s Mart',
      html: customerEmailHTML // Using HTML format for customer email
    });

    console.log('Order notification emails sent successfully');
  } catch (error) {
    console.error('Error sending order notification emails:', error);
  }
}

/**
 * Database Schemas
 */

// Order Schema - Stores all order related information
const orderSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  userMobile: { type: String, required: true },
  items: [{
    itemId: String,
    itemName: String,
    unitPrice: Number,
    quantity: Number,
    totalPrice: Number
  }],
  grandTotal: Number,
  orderDate: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// Review Schema
const reviewSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Review = mongoose.model('Review', reviewSchema);

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true }, // This will store the image filename
  quantity: { type: Number, required: true },
  description: { type: String, required: true }
});

const Product = mongoose.model('Product', productSchema);

/**
 * API Endpoints
 */

// Get all products

app.get('/',(req,res)=>{
  res.sendFile(path.join(__dirname,'build','index.html'))
})

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    const productsWithImageUrls = products.map(product => ({
      ...product.toObject(),
      image: product.image ? product.image : null
    }));
    res.json(productsWithImageUrls);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
});

// Search products
app.get('/api/products/search', async (req, res) => {
  try {
    const searchQuery = req.query.q;
    const products = await Product.find({
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } },
        { category: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } }
      ]
    });
    const productsWithImageUrls = products.map(product => ({
      ...product.toObject(),
      image: product.image ? product.image : null
    }));
    res.json(productsWithImageUrls);
  } catch (error) {
    res.status(500).json({ message: 'Error searching products', error });
  }
});

// Get products by category
app.get('/api/products/category/:category', async (req, res) => {
  try {
    const category = req.params.category;
    const products = await Product.find({ category });
    const productsWithImageUrls = products.map(product => ({
      ...product.toObject(),
      image: product.image ? product.image : null
    }));
    res.json(productsWithImageUrls);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching category products', error });
  }
});

// API endpoint to add a product with image upload
app.post('/api/products', upload.single('image'), async (req, res) => {
  try {
    const { name, category, price, quantity, description } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const product = new Product({
      name,
      category,
      price: Number(price),
      image: `/images/products/${req.file.filename}`, // Store relative path
      quantity: Number(quantity),
      description
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// Create new order with better error handling
app.post('/api/orders', async (req, res) => {
  console.log('Received order request:', req.body);
  
  try {
    // Validate required fields
    const { userName, userEmail, userMobile, items } = req.body;
    
    if (!userName || !userEmail || !userMobile || !items) {
      console.log('Missing required fields:', { userName, userEmail, userMobile, items });
      return res.status(400).json({ 
        message: 'Missing required fields',
        details: 'Please provide userName, userEmail, userMobile, and items'
      });
    }

    // Create new order
    const newOrder = new Order(req.body);
    console.log('Created new order object:', newOrder);

    // Save to database
    const savedOrder = await newOrder.save();
    console.log('Order saved successfully:', savedOrder);
    
    // Send email notification
    try {
      await sendOrderNotification(savedOrder);
      console.log('Order notification sent successfully');
    } catch (emailError) {
      console.error('Error sending order notification:', emailError);
      // Continue even if email fails
    }
    
    res.status(201).json({
      message: 'Order placed successfully',
      order: savedOrder
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ 
      message: 'Error creating order', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Reviews API endpoints
app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ date: -1 });
    console.log('Fetched reviews:', reviews);
    
    if (!reviews || reviews.length === 0) {
      // If no reviews exist, create some sample reviews
      const sampleReviews = [
        {
          userName: "John Doe",
          rating: 5,
          comment: "Great selection of Indian groceries! The prices are reasonable and the quality is excellent.",
          date: new Date()
        },
        {
          userName: "Sarah Smith",
          rating: 4,
          comment: "Love the variety of spices and lentils. Quick delivery and good packaging.",
          date: new Date()
        },
        {
          userName: "Raj Patel",
          rating: 5,
          comment: "Authentic Indian products at great prices. Will definitely shop again!",
          date: new Date()
        }
      ];
      
      const createdReviews = await Review.insertMany(sampleReviews);
      console.log('Created sample reviews:', createdReviews);
      return res.json(createdReviews);
    }
    
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});

app.post('/api/reviews', async (req, res) => {
  try {
    const { userName, rating, comment } = req.body;
    
    if (!userName || !rating || !comment) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    const newReview = new Review({
      userName,
      rating,
      comment,
      date: new Date()
    });
    
    const savedReview = await newReview.save();
    console.log('New review saved:', savedReview);
    res.status(201).json(savedReview);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Error creating review' });
  }
});

// Get all reviews
app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ timestamp: -1 }); // Get latest reviews first
    console.log('Reviews fetched successfully:', reviews.length);
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ 
      error: 'Failed to fetch reviews',
      details: error.message 
    });
  }
});

// Add new review
app.post('/api/reviews', async (req, res) => {
  try {
    const { userName, text } = req.body;
    
    if (!userName || !text) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: 'Please provide userName and text'
      });
    }

    const newReview = new Review({
      userName,
      text,
      timestamp: new Date()
    });

    const savedReview = await newReview.save();
    console.log('Review saved successfully:', savedReview);
    res.status(201).json(savedReview);
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ 
      error: 'Failed to add review',
      details: error.message 
    });
  }
});

// Sample reviews data
const sampleReviews = [
  {
    userName: "John Doe",
    rating: 5,
    comment: "Great selection of Indian groceries! The prices are reasonable and the quality is excellent.",
    date: new Date()
  },
  {
    userName: "Sarah Smith",
    rating: 4,
    comment: "Love the variety of spices and lentils. Quick delivery and good packaging.",
    date: new Date()
  },
  {
    userName: "Raj Patel",
    rating: 5,
    comment: "Authentic Indian products at great prices. Will definitely shop again!",
    date: new Date()
  }
];

// Initialize reviews data
app.post('/api/initialize-reviews', async (req, res) => {
  try {
    // Clear existing reviews
    await Review.deleteMany({});
    
    // Insert sample reviews
    const reviews = await Review.insertMany(sampleReviews);
    console.log('Sample reviews initialized:', reviews);
    
    res.json({ message: 'Reviews initialized successfully', reviews });
  } catch (error) {
    console.error('Error initializing reviews:', error);
    res.status(500).json({ message: 'Error initializing reviews' });
  }
});

// Initialize sample data with local images
app.post('/api/initialize-data', async (req, res) => {
  try {
    // Clear existing products
    await Product.deleteMany({});

    // Sample products with local images
    const sampleProducts = [
      {
        name: 'Sprite',
        category: 'Cold Drinks',
        price: 25,
        image: '/images/products/sprite.jpg',
        quantity: 150,
        description: 'Refreshing lemon-lime flavored drink 750ml'
      },
      {
        name: 'Toor Dal',
        category: 'Dals',
        price: 180,
        image: '/images/products/toor-dal.jpg',
        quantity: 1000,
        description: 'Premium quality Toor Dal 1kg'
      },
      {
        name: ' Milk',
        category: 'Dairy',
        price: 20,
        image: '/images/products/milk.jpg',
        quantity: 200,
        description: 'Fresh  Milk 150ml'
      },
      {
        name: 'Fortune Oil',
        category: 'Oils',
        price: 220,
        image: '/images/products/fortune-oil.jpg',
        quantity: 300,
        description: 'Fortune Sunflower Oil 1L'
      },
      {
        name: 'Aashirvaad Atta',
        category: 'Atta & Flours',
        price: 350,
        image: '/images/products/aashirvaad-atta.jpg',
        quantity: 400,
        description: 'Aashirvaad Superior MP Atta 5kg'
      },
      {
        name: 'MDH Masala',
        category: 'Masala',
        price: 85,
        image: '/images/products/mdh-masala.jpg',
        quantity: 250,
        description: 'MDH Mixed Masala 100g'
      },
      {
        name: 'Test Product',
        category: 'Test',
        price: 99,
        image: '/images/products/test.jpg',
        quantity: 100,
        description: 'Test Product Description'
      },
      {
        name: 'Surf Excel',
        category: 'Soaps/Detergents',
        price: 190,
        image: '/images/products/surf-excel.jpg',
        quantity: 150,
        description: 'Surf Excel Easy Wash Detergent 1.5kg'
      },
      {
        name: 'Parle-G',
        category: 'Biscuits',
        price: 20,
        image: '/images/products/parle.jpg',
        quantity: 500,
        description: 'Parle-G Original Glucose Biscuits 250g'
      }
    ];

    const savedProducts = await Product.insertMany(sampleProducts);
    res.json(savedProducts);
  } catch (error) {
    console.error('Error initializing data:', error);
    res.status(500).json({ error: 'Failed to initialize data' });
  }
});

// API endpoint to get sales analytics
app.get('/api/sales/analytics', async (req, res) => {
  try {
    // Get all orders
    const orders = await Order.find({});
    
    // Create a map to store product sales data
    const productSales = {};
    
    // Process each order
    orders.forEach(order => {
      order.items.forEach(item => {
        if (!productSales[item.itemName]) {
          productSales[item.itemName] = {
            totalQuantity: 0,
            totalRevenue: 0,
            orderCount: 0
          };
        }
        productSales[item.itemName].totalQuantity += item.quantity;
        productSales[item.itemName].totalRevenue += item.totalPrice;
        productSales[item.itemName].orderCount += 1;
      });
    });

    // Convert to array and sort by quantity
    const sortedProducts = Object.entries(productSales)
      .map(([name, data]) => ({
        name,
        ...data,
        averageOrderSize: data.totalQuantity / data.orderCount
      }))
      .sort((a, b) => b.totalQuantity - a.totalQuantity);

    // Get sales by date
    const salesByDate = {};
    orders.forEach(order => {
      const date = order.orderDate.toISOString().split('T')[0];
      if (!salesByDate[date]) {
        salesByDate[date] = {
          totalRevenue: 0,
          orderCount: 0
        };
      }
      salesByDate[date].totalRevenue += order.grandTotal;
      salesByDate[date].orderCount += 1;
    });

    res.json({
      topProducts: sortedProducts,
      salesByDate: salesByDate,
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + order.grandTotal, 0)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error getting sales analytics', error });
  }
});

// Analytics helper functions
function calculateSupport(itemset, orders) {
  const containsItemset = orders.filter(order => 
    itemset.every(item => 
      order.items.some(orderItem => orderItem.itemName === item)
    )
  ).length;
  return containsItemset / orders.length;
}

function calculateConfidence(antecedent, consequent, orders) {
  const supportAntecedent = calculateSupport(antecedent, orders);
  const supportBoth = calculateSupport([...antecedent, ...consequent], orders);
  return supportBoth / supportAntecedent;
}

function findFrequentPatterns(orders, minSupport) {
  // Get all unique items
  const items = new Set();
  orders.forEach(order => 
    order.items.forEach(item => 
      items.add(item.itemName)
    )
  );

  // First pass: count individual item frequencies
  const itemCounts = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      itemCounts[item.itemName] = (itemCounts[item.itemName] || 0) + 1;
    });
  });

  // Filter items meeting minimum support
  const frequentItems = Object.entries(itemCounts)
    .filter(([_, count]) => count >= minSupport)
    .map(([item]) => item);

  // Generate candidate pairs from frequent items
  const pairs = [];
  for (let i = 0; i < frequentItems.length; i++) {
    for (let j = i + 1; j < frequentItems.length; j++) {
      pairs.push([frequentItems[i], frequentItems[j]]);
    }
  }

  // Count pair frequencies
  const pairCounts = {};
  orders.forEach(order => {
    const orderItems = order.items.map(item => item.itemName);
    pairs.forEach(pair => {
      if (pair.every(item => orderItems.includes(item))) {
        const key = pair.join('__');
        pairCounts[key] = (pairCounts[key] || 0) + 1;
      }
    });
  });

  // Return frequent pairs meeting minimum support
  return Object.entries(pairCounts)
    .filter(([_, count]) => count >= minSupport)
    .map(([pair, count]) => ({
      products: pair.split('__'),
      count,
      support: count / orders.length
    }))
    .sort((a, b) => b.count - a.count);
}

function findAssociationRules(orders, minSupport, minConfidence) {
  const frequentPairs = findFrequentPatterns(orders, minSupport * orders.length);
  
  const rules = [];
  frequentPairs.forEach(pair => {
    const [item1, item2] = pair.products;
    
    // Check confidence in both directions
    const conf1 = calculateConfidence([item1], [item2], orders);
    const conf2 = calculateConfidence([item2], [item1], orders);
    
    if (conf1 >= minConfidence) {
      rules.push({
        if_buy: item1,
        then_buy: item2,
        confidence: conf1,
        support: pair.support
      });
    }
    
    if (conf2 >= minConfidence) {
      rules.push({
        if_buy: item2,
        then_buy: item1,
        confidence: conf2,
        support: pair.support
      });
    }
  });
  
  return rules.sort((a, b) => b.confidence - a.confidence);
}

// Get frequent product combinations
app.get('/api/sales/patterns', async (req, res) => {
  try {
    const orders = await Order.find({});
    
    // Set minimum support to 5% of total orders and minimum confidence to 30%
    const minSupport = Math.max(1, Math.floor(orders.length * 0.05));
    const minConfidence = 0.3;

    // Find frequent patterns using Apriori
    const frequentPairs = findFrequentPatterns(orders, minSupport);

    // Generate association rules
    const associationRules = findAssociationRules(orders, 0.05, minConfidence);

    res.json({
      frequentPairs: frequentPairs.map(pair => ({
        products: pair.products,
        count: pair.count,
        support: (pair.support * 100).toFixed(1) + '%'
      })),
      recommendationRules: associationRules.map(rule => ({
        if_buy: rule.if_buy,
        then_buy: rule.then_buy,
        confidence: (rule.confidence * 100).toFixed(1) + '%',
        support: (rule.support * 100).toFixed(1) + '%'
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Error getting product patterns', error });
  }
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  
  // Initialize sample data if no products exist
  try {
    const existingProducts = await Product.countDocuments();
    if (existingProducts === 0) {
      const response = await fetch(`http://localhost:${PORT}/api/initialize-data`, {
        method: 'POST'
      });
      if (response.ok) {
        console.log('Sample data initialized successfully');
      }
    }
  } catch (error) {
    console.error('Error checking/initializing sample data:', error);
  }
});
