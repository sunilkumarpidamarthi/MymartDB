/**
 * Indian Grocery Mart - Main Application Component
 * 
 * This is the main component of the Indian Grocery Mart e-commerce application.
 * It handles product display, shopping cart management, category filtering,
 * product search, customer reviews, and order placement.
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  InputBase,
  IconButton,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  Select,
  MenuItem,
  CardMedia,
  CardContent,
  CardActions,
  TextField,
  ThemeProvider,
  createTheme,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  DialogActions
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import RecommendIcon from '@mui/icons-material/Recommend';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CloseIcon from '@mui/icons-material/Close';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import PaidIcon from '@mui/icons-material/Paid';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  StyledAppBar,
  ProductCard,
  ReviewsContainer,
  OfferBanner,
  MarqueeText,
  CartDialog
} from './styles';

// Create Material-UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32',
    },
    secondary: {
      main: '#ff6b6b',
    },
  },
  typography: {
    fontFamily: '"Poppins", sans-serif',
  },
});

// Product categories
const categories = ['All', 'Dals', 'Dairy', 'Oils', 'Atta & Flours', 'Masala', 'Soaps/Detergents', 'Biscuits', 'Cold Drinks','Snacks'];

// API URL constant
const API_URL = process.env.NODE_ENV === 'production' 
  ? '' // Empty string for same-origin requests in production
  : 'http://localhost:5000'; // Development server

// Sample products data
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
    name: 'Toor Dal(Kandi Papu)',
    category: 'Dals',
    price: 10,
    image: '/images/products/kandipapu.jpg',
    quantity: 1000,
    description: 'Kandi Papu Toor Dal 1kg'
  },
  {
    name: ' Milk',
    category: 'Dairy',
    price: 20,
    image: '/images/products/Milk.jpg',
    quantity: 200,
    description: 'Fresh  Milk 150ml'
  },
  {
    name: ' Kissan Jam',
    category: 'Dairy',
    price: 150,
    image: '/images/products/jam.jpg',
    quantity: 200,
    description: 'Kissan jam Mixed Fruits 500g'
  },

  {
    name: ' Fresh Ghee',
    category: 'Dairy',
    price: 200,
    image: '/images/products/GHEE.jpg',
    quantity: 200,
    description: 'Fresh Cow Ghee 500g'
  },
  {
    name: ' Bread',
    category: 'Dairy',
    price: 20,
    image: '/images/products/bread.jpg',
    quantity: 200,
    description: 'Fresh Bread 500g'
  },
  {
    name: ' Britania',
    category: 'Biscuits',
    price: 20,
    image: '/images/products/britannia-marie-gold-biscuits.webp',
    quantity: 200,
    description: 'Britania Original Glucose Biscuits 250g'
  },
  {
    name: ' Good Day',
    category: 'Biscuits',
    price: 20,
    image: '/images/products/Good-Day-Butter-Cookie-75g.jpg',
    quantity: 200,
    description: 'Good Day Butter Cookie 75g'
  },
  {
    name: ' Maggi',
    category: 'Snacks',
    price: 10,
    image: '/images/products/MAGGI.jpeg',
    quantity: 200,
    description: 'Instant 2 Minutes Maggi Masala 100g'
  },
  {
    name: 'Freedom Oil',
    category: 'Oils',
    price: 220,
    image:'/images/products/freedom-refined-oil-sunflower.webp',
    quantity: 300,
    description: 'Freedom Refined Sunflower Oil 1L'
  },
  {
    name: 'Aashirvaad Atta',
    category: 'Atta & Flours',
    price: 350,
    image: '/images/products/atta.jpeg',
    quantity: 400,
    description: 'Aashirvaad Superior MP Atta 5kg'
  },
  {
    name: 'Coriander Masala(Dhaniyala Powder)',
    category: 'Masala',
    price: 85,
    image: '/images/products/coriander.webp',
    quantity: 250,
    description: 'Coriander Masala 1kg'
  },
  {
    name: 'Salt 1kg',
    category: 'Masala',
    price: 25,
    image: '/images/products/salt.jpg',
    quantity: 250,
    description: ' TATA Salt 1kg'
  },
  {
    name: 'Turmeric Powder(Pasupu))',
    category: 'Masala',
    price: 85,
    image: '/images/products/turmeric-powder.webp',
    quantity: 250,
    description: 'Turmeric Powder 1kg'
  },
  {
    name: 'Lays',
    category: 'Snacks',
    price: 25,
    image: '/images/products/LAYS.jpeg',
    quantity: 250,
    description: 'Lays Original Snacks 100g'
  },
  {
    name: 'Soya Mini Chunks',
    category: 'Snacks',
    price: 25,
    image: '/images/products/SOYA CHUNKS.jpeg',
    quantity: 250,
    description: ' Saffola Soya Mini Chunks 45g'
  },
  {
    name: 'Monster',
    category: 'Cold Drinks',
    price: 40,
    image: '/images/products/monster.jpg',
    quantity: 100,
    description: 'Energy Boost Drink 100ml'
  },
  {
    name: 'Thumsup',
    category: 'Cold Drinks',
    price: 25,
    image: '/images/products/thumsup.jpg',
    quantity: 100,
    description: 'Energy Boost Drink 100ml'
  },

  {
    name: 'String',
    category: 'Cold Drinks',
    price: 25,
    image: '/images/products/sting-energy-drink.webp',
    quantity: 100,
    description: 'Energy Boost Drink 100ml'
  },
  {
    name: 'Pepsi',
    category: 'Cold Drinks',
    price: 25,
    image: '/images/products/pepsi.jpg',
    quantity: 100,
    description: 'Energy Boost Drink 100ml'
  },
  {
    name: 'Kurkure',
    category: 'Snacks',
    price: 190,
    image: '/images/products/kurkure.jpg',
    quantity: 150,
    description: 'Kurkure Spicy Chilli Chat Pata 150g'
  },

  {
    name: 'Surf Excel',
    category: 'Soaps/Detergents',
    price: 190,
    image: '/images/products/SURF EXCEL.jpg',
    quantity: 150,
    description: 'Surf Excel Easy Wash Detergent 1.5kg'
  },
  {
    name: 'Ariel Liquid',
    category: 'Soaps/Detergents',
    price: 100,
    image: '/images/products/ARIEL.jpg',
    quantity: 150,
    description: 'Ariel Liquid Easy Wash  1.5l Front load'
  },
  {
    name: 'Cinthol Soap',
    category: 'Soaps/Detergents',
    price: 35,
    image: '/images/products/Cinthol.jpg',
    quantity: 150,
    description: 'Cinthol Lime Freshness Bathroom Soap with TFM 75% 50gm'
  },
  {
    name: 'Medimix Soap',
    category: 'Soaps/Detergents',
    price: 80,
    image: '/images/products/Medimix-Soap.jpg',
    quantity: 150,
    description: 'Medimix Neem Coated Olive oil Soap With 65% TFM 75gm'
  },
  {
    name: 'Mysore Sandal Soap',
    category: 'Soaps/Detergents',
    price: 190,
    image: '/images/products/mysore-sandal-sandalwood-soap.jpg',
    quantity: 150,
    description: 'Mysore Sandal Sandalwood Soap with 85% TFM 100gm'
  },
  {
    name: 'Pears Soap',
    category: 'Soaps/Detergents',
    price: 100,
    image: '/images/products/Pears_Soap.jpg',
    quantity: 150,
    description: 'Pears Soap with 65% TFM 100gm'
  },
  {
    name: 'Safe Wash',
    category: 'Soaps/Detergents',
    price: 100,
    image: '/images/products/SAFEWASH.jpg',
    quantity: 150,
    description: 'Safe Wash 1l Front Load'
  },
  {
    name: 'Rin Liquid',
    category: 'Soaps/Detergents',
    price: 100,
    image: '/images/products/RIN.jpg',
    quantity: 150,
    description: 'Rin Liquid Easy Wash 500ml Front Load'
  },
  {
    name: 'Santhoor',
    category: 'Soaps/Detergents',
    price: 50,
    image: '/images/products/Santhoor.jpg',
    quantity: 150,
    description: 'Santhoor Soap with 65% TFM 100gm'
  },
  {
    name: 'Kamasuthra',
    category: 'Soaps/Detergents',
    price: 190,
    image: '/images/products/KS.jpg',
    quantity: 150,
    description: 'Kamasuthra Body Spray for Men 150ml Ever Lasting Freshness'
  },
  {
    name: 'Tide Detergent Liquid',
    category: 'Soaps/Detergents',
    price: 190,
    image: '/images/products/TIDE.jpg',
    quantity: 150,
    description: 'Surf Excel Easy Wash Detergent 1.5kg'
  },
  {
    name: 'Signature Yolo Body Spray',
    category: 'Soaps/Detergents',
    price: 290,
    image: '/images/products/signature-yolo-deodorant-body-spray.jpg',
    quantity: 150,
    description: 'Signature Yolo Deodorant Body Spray 150ml'
  },
  {
    name: 'Park Avenue Body Spray',
    category: 'Soaps/Detergents',
    price: 220,
    image: '/images/products/PARKAVENUE.jpg',
    quantity: 150,
    description: 'Park Avenue Deodorant Body Spray 150ml'
  },
  {
    name: 'Nivea MenBody Spray',
    category: 'Soaps/Detergents',
    price: 200,
    image: '/images/products/Niveamenspray.jpg',
    quantity: 150,
    description: 'Nivea Men Body Spray 150ml'
  },
  {
    name: 'Layer Shot Men ',
    category: 'Soaps/Detergents',
    price: 250,
    image: '/images/products/Layershot.jpg',
    quantity: 150,
    description: 'Layer Shot Men Body Spray 150ml'
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

export default function App() {
  // State Management
  const [cart, setCart] = useState([]); // Shopping cart items
  const [cartOpen, setCartOpen] = useState(false); // Cart dialog visibility
  const [products, setProducts] = useState(sampleProducts); // Initialize with sample products
  const [searchTerm, setSearchTerm] = useState(''); // Search input
  const [selectedCategory, setSelectedCategory] = useState('All'); // Selected category
  const [reviews, setReviews] = useState([]); // All reviews
  const [visibleReviews, setVisibleReviews] = useState([]); // Currently visible reviews
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    userName: '',
    rating: 5,
    comment: ''
  });
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userMobile, setUserMobile] = useState('');
  const [userDetailsError, setUserDetailsError] = useState('');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);

  /**
   * Initialize products with sample data
   * Called when component mounts
   */
  useEffect(() => {
    // Store sample data in database but don't fetch from it
    const initializeSampleData = async () => {
      try {
        await fetch(`${API_URL}/api/initialize-data`, {
          method: 'POST'
        });
      } catch (error) {
        console.error('Error initializing data:', error);
      }
    };

    initializeSampleData();
  }, []);

  /**
   * Fetch reviews on component mount
   */
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        console.log('Fetching reviews...');
        const response = await fetch(`${API_URL}/api/reviews`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        
        const data = await response.json();
        console.log('Fetched reviews:', data);
        
        if (Array.isArray(data) && data.length > 0) {
          setReviews(data);
          setVisibleReviews([data[0]]);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
        toast.error('Failed to load reviews', {
          icon: '❌'
        });
      }
    };

    fetchReviews();
  }, []);

  /**
   * Rotate reviews every 5 seconds
   */
  useEffect(() => {
    if (!Array.isArray(reviews) || reviews.length === 0) return;

    const interval = setInterval(() => {
      setVisibleReviews(prevVisible => {
        const currentIndex = reviews.findIndex(r => r === prevVisible[0]);
        const nextIndex = (currentIndex + 1) % reviews.length;
        return [reviews[nextIndex]];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [reviews]);

  /**
   * Handle adding a product to the shopping cart
   * If product exists, increment quantity; otherwise add as new item
   * @param {Object} product - Product to add to cart
   */
  const handleAddToCart = (product) => {
    const existingItem = cart.find(item => item.name === product.name);
    if (existingItem) {
      setCart(cart.map(item =>
        item.name === product.name
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
      toast.success(`Added another ${product.name} to cart`, {
        icon: '🛒'
      });
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
      toast.success(`${product.name} added to cart!`, {
        icon: '🛒'
      });
    }
  };

  /**
   * Handle updating product quantity in cart
   * @param {string} productId - ID of product to update
   * @param {number} newQuantity - New quantity value
   */
  const handleQuantityChange = (productName, newQuantity) => {
    setCart(cart.map(item =>
      item.name === productName
        ? { ...item, quantity: parseInt(newQuantity) }
        : item
    ));
  };

  /**
   * Handle category filter selection
   * @param {string} category - Selected category
   */
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setProducts(sampleProducts);
    } else {
      setProducts(sampleProducts.filter(product => product.category === category));
    }
  };

  /**
   * Place order with current cart items
   * Sends order data to backend and clears cart on success
   */
  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty!', {
        icon: '❌'
      });
      return;
    }

    if (!userName.trim() || !userEmail.trim() || !userMobile.trim()) {
      setUserDetailsError('Please enter your name, email, and mobile number');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail.trim())) {
      setUserDetailsError('Please enter a valid email address');
      return;
    }

    // Validate mobile number (10 digits)
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(userMobile.trim())) {
      setUserDetailsError('Please enter a valid 10-digit mobile number');
      return;
    }

    const orderData = {
      userName: userName.trim(),
      userEmail: userEmail.trim(),
      userMobile: userMobile.trim(),
      items: cart.map(item => ({
        itemName: item.name,
        unitPrice: item.price,
        quantity: item.quantity,
        totalPrice: item.price * item.quantity
      })),
      grandTotal: cart.reduce((total, item) => total + (item.price * item.quantity), 0)
    };

    try {
      console.log('Sending order data:', orderData);
      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Order placed successfully! Check your email for confirmation.', {
          icon: '✅'
        });
        setCart([]);
        setCartOpen(false);
        setUserName('');
        setUserEmail('');
        setUserMobile('');
        setUserDetailsError('');
      } else {
        throw new Error(data.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error(error.message || 'Failed to place order. Please check your connection.', {
        icon: '❌'
      });
    }
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    
    // Filter products based on search term
    if (term === '') {
      setProducts(selectedCategory === 'All' ? sampleProducts : sampleProducts.filter(product => product.category === selectedCategory));
    } else {
      const filtered = sampleProducts.filter(product => 
        (product.name.toLowerCase().includes(term) || product.description.toLowerCase().includes(term)) &&
        (selectedCategory === 'All' || product.category === selectedCategory)
      );
      setProducts(filtered);
    }
  };

  // Fetch analytics data
  const fetchAnalytics = async () => {
    try {
      const [analyticsResponse, patternsResponse] = await Promise.all([
        fetch(`${API_URL}/api/sales/analytics`),
        fetch(`${API_URL}/api/sales/patterns`)
      ]);

      if (!analyticsResponse.ok || !patternsResponse.ok) {
        throw new Error('Failed to fetch analytics data');
      }

      const [analytics, patterns] = await Promise.all([
        analyticsResponse.json(),
        patternsResponse.json()
      ]);

      setAnalyticsData({ ...analytics, ...patterns });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data', {
        icon: '📊'
      });
    }
  };

  // Render analytics dashboard
  const renderAnalytics = () => {
    if (!analyticsData) return null;

    return (
      <Dialog 
        open={analyticsOpen} 
        onClose={() => setAnalyticsOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            minHeight: '90vh',
            maxHeight: '90vh',
            background: '#f8f9fa'
          }
        }}
      >
        <DialogTitle sx={{ 
          background: '#1a237e',
          color: 'white',
          py: 3,
          borderBottom: '1px solid #e0e0e0'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <BarChartIcon sx={{ fontSize: 40 }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              Sales Analytics Dashboard
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          {/* Overview Section */}
          <Box sx={{ mb: 5 }}>
            <Typography variant="h5" sx={{ 
              mb: 3, 
              color: '#1a237e',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <TimelineIcon /> Overview
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Paper sx={{ 
                  p: 3, 
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
                  color: 'white',
                  borderRadius: 2,
                  boxShadow: 3
                }}>
                  <ShoppingBagIcon sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h6" sx={{ mb: 1 }}>Total Orders</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {analyticsData.totalOrders}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={3}>
                <Paper sx={{ 
                  p: 3, 
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #2e7d32 0%, #388e3c 100%)',
                  color: 'white',
                  borderRadius: 2,
                  boxShadow: 3
                }}>
                  <CurrencyRupeeIcon sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h6" sx={{ mb: 1 }}>Total Revenue</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    ₹{analyticsData.totalRevenue?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={3}>
                <Paper sx={{ 
                  p: 3, 
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #d32f2f 0%, #e53935 100%)',
                  color: 'white',
                  borderRadius: 2,
                  boxShadow: 3
                }}>
                  <LocalShippingIcon sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h6" sx={{ mb: 1 }}>Avg. Daily Orders</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {(analyticsData.totalOrders / Object.keys(analyticsData.salesByDate || {}).length).toFixed(1)}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={3}>
                <Paper sx={{ 
                  p: 3, 
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #f57c00 0%, #fb8c00 100%)',
                  color: 'white',
                  borderRadius: 2,
                  boxShadow: 3
                }}>
                  <PaidIcon sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h6" sx={{ mb: 1 }}>Avg. Order Value</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    ₹{(analyticsData.totalRevenue / analyticsData.totalOrders).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>

          <Grid container spacing={4}>
            {/* Top Products Section */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2, height: '100%' }}>
                <Typography variant="h5" sx={{ 
                  mb: 3, 
                  color: '#1a237e',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <LocalMallIcon /> Top Selling Products
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', color: '#1a237e' }}>Product</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', color: '#1a237e' }}>Quantity</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', color: '#1a237e' }}>Revenue</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', color: '#1a237e' }}>Avg. Order</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {analyticsData.topProducts?.slice(0, 5).map((product) => (
                        <TableRow key={product.name} hover>
                          <TableCell sx={{ fontWeight: 500 }}>{product.name}</TableCell>
                          <TableCell align="right">{product.totalQuantity}</TableCell>
                          <TableCell align="right">₹{product.totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</TableCell>
                          <TableCell align="right">{product.averageOrderSize.toFixed(1)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>

            {/* Product Recommendations Section */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2, height: '100%' }}>
                <Typography variant="h5" sx={{ 
                  mb: 3, 
                  color: '#1a237e',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <RecommendIcon /> Product Recommendations
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', color: '#1a237e' }}>If Customer Buys</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#1a237e' }}>Recommend</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', color: '#1a237e' }}>Confidence</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', color: '#1a237e' }}>Support</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {analyticsData.recommendationRules?.slice(0, 5).map((rule, index) => (
                        <TableRow key={index} hover>
                          <TableCell sx={{ fontWeight: 500 }}>{rule.if_buy}</TableCell>
                          <TableCell>{rule.then_buy}</TableCell>
                          <TableCell align="right">{rule.confidence}</TableCell>
                          <TableCell align="right">{rule.support}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>

            {/* Frequent Combinations Section */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2, height: '100%' }}>
                <Typography variant="h5" sx={{ 
                  mb: 3, 
                  color: '#1a237e',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <CompareArrowsIcon /> Frequently Bought Together
                </Typography>
                <List>
                  {analyticsData.frequentPairs?.slice(0, 5).map((pair, index) => (
                    <ListItem 
                      key={index}
                      sx={{
                        mb: 1,
                        backgroundColor: index % 2 === 0 ? 'rgba(26, 35, 126, 0.05)' : 'transparent',
                        borderRadius: 1,
                        '&:hover': {
                          backgroundColor: 'rgba(26, 35, 126, 0.1)',
                        }
                      }}
                    >
                      <ListItemIcon>
                        <ShoppingBasketIcon sx={{ color: '#1a237e' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography sx={{ fontWeight: 500 }}>
                            {pair.products[0]} + {pair.products[1]}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2" color="text.secondary">
                            Bought together {pair.count} times (Support: {pair.support})
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>

            {/* Sales by Date Section */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2, height: '100%' }}>
                <Typography variant="h5" sx={{ 
                  mb: 3, 
                  color: '#1a237e',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <CalendarTodayIcon /> Daily Sales
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', color: '#1a237e' }}>Date</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', color: '#1a237e' }}>Orders</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', color: '#1a237e' }}>Revenue</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(analyticsData.salesByDate || {})
                        .sort((a, b) => new Date(b[0]) - new Date(a[0]))
                        .slice(0, 7)
                        .map(([date, data]) => (
                          <TableRow key={date} hover>
                            <TableCell sx={{ fontWeight: 500 }}>
                              {new Date(date).toLocaleDateString('en-IN', { 
                                weekday: 'short',
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </TableCell>
                            <TableCell align="right">{data.orderCount}</TableCell>
                            <TableCell align="right">₹{data.totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid #e0e0e0' }}>
          <Button 
            onClick={() => setAnalyticsOpen(false)}
            variant="contained"
            color="primary"
            startIcon={<CloseIcon />}
            sx={{ px: 4 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  // Handle submitting a new review
  const handleSubmitReview = async () => {
    if (!newReview.userName || !newReview.rating || !newReview.comment) {
      toast.error('Please fill in all review fields', {
        icon: '❌'
      });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newReview)
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      const savedReview = await response.json();
      setReviews(prevReviews => [...prevReviews, savedReview]);
      setReviewFormOpen(false);
      setNewReview({
        userName: '',
        rating: 5,
        comment: ''
      });
      toast.success('Review submitted successfully!', {
        icon: '✨'
      });
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review', {
        icon: '❌'
      });
    }
  };

  // Dialog for writing reviews
  const ReviewDialog = () => (
    <Dialog open={reviewFormOpen} onClose={() => setReviewFormOpen(false)}>
      <DialogTitle>Write a Review</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Your Name"
          fullWidth
          value={newReview.userName}
          onChange={(e) => setNewReview({ ...newReview, userName: e.target.value })}
        />
        <Box sx={{ mt: 2 }}>
          <Typography>Rating</Typography>
          <Select
            value={newReview.rating}
            onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
            fullWidth
          >
            {[1, 2, 3, 4, 5].map((rating) => (
              <MenuItem key={rating} value={rating}>
                {'⭐'.repeat(rating)}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <TextField
          margin="dense"
          label="Your Review"
          fullWidth
          multiline
          rows={4}
          value={newReview.comment}
          onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setReviewFormOpen(false)}>Cancel</Button>
        <Button onClick={handleSubmitReview} variant="contained" color="primary">
          Submit Review
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Display reviews
  const ReviewsSection = () => (
    <ReviewsContainer>
      {visibleReviews.map((review, index) => (
        <Paper 
          key={index} 
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 2,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            width: '100%',
            maxWidth: '800px',
            margin: '0 auto'
          }}
        >
          <Typography variant="h6" gutterBottom>
            {review.userName}
          </Typography>
          <Typography color="primary" gutterBottom>
            {'⭐'.repeat(review.rating)}
          </Typography>
          <Typography variant="body1">
            {review.comment}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            {new Date(review.date).toLocaleDateString()}
          </Typography>
        </Paper>
      ))}
    </ReviewsContainer>
  );

  // Handle cart item removal
  const handleRemoveFromCart = (productName) => {
    setCart(prevCart => prevCart.filter(item => item.name !== productName));
    toast.success('Item removed from cart', {
      icon: '🗑️'
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1 }}>
        <StyledAppBar position="sticky">
          <Box className="top-bar-container">
            <Box className="top-bar">
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white',fontSize:'2.5rem', }}>
                Sunil's Mart
          </Typography>
          
              <Box className="search-container">
                <Paper
                  sx={{
                    p: '2px 4px',
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    borderRadius: '12px'
                  }}
                >
                  <InputBase
            placeholder="Search products..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    sx={{ ml: 2, flex: 1, fontSize: '2rem' }}
                  />
                  <IconButton type="button" sx={{ p: '15px' }}>
                    <SearchIcon sx={{ fontSize: '2rem' }} />
                  </IconButton>
                </Paper>
              </Box>

              <Box className="cart-review-container">
                <Button
                  variant="contained"
                  onClick={() => setReviewFormOpen(true)}
                  sx={{ 
                    bgcolor: 'black',
                    color: 'white',
                    fontSize: '1.2rem',
                    py: 1.5,
                    px: 3,
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.8)'
                    }
                  }}
                >
                  Write a Review
                </Button>
                <IconButton 
                  onClick={() => setCartOpen(true)} 
                  sx={{ 
                    color: 'white',
                    '&:hover': { color: 'black' }
                  }}
                >
                  <Badge badgeContent={cart.length} color="error">
                    <ShoppingCartIcon sx={{ fontSize: 40 }} />
            </Badge>
          </IconButton>
                <IconButton 
                  color="inherit" 
                  onClick={() => {
                    fetchAnalytics();
                    setAnalyticsOpen(true);
                  }}
                  sx={{ mr: 2 }}
                >
                  <BarChartIcon sx={{ fontSize: 40 }} />
                </IconButton>
              </Box>
            </Box>
          </Box>

          <Box className="notification-bar">
            <MarqueeText>
              🎉Welcome to Sunil's Mart Special Offer! Get 20% off on all items this weekend! | 🚚 Free delivery on orders above ₹500 | 🌟 New items added to our collection
            </MarqueeText>
          </Box>

          <Box className="categories-bar-container">
            <Box className="categories-bar">
              {categories.map((category) => (
                <Button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className={selectedCategory === category ? 'active' : ''}
                  sx={{
                    color: 'white',
                    fontSize: '1.2rem',
                    py: 1.5,
                    px: 3,
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.8)'
                    }
                  }}
                >
                  {category}
                </Button>
              ))}
            </Box>
          </Box>
        </StyledAppBar>

        <Container maxWidth={false} sx={{ mt: 4, px: 4, maxWidth: '2000px' }}>
          <OfferBanner>
            <img 
              src="images/products/offer-banner.jpg" 
              alt="Special Offers - Get up to 50% off on all groceries!" 
              style={{ 
                width: '100%', 
                height: '200%', 
                objectFit: 'cover' 
              }} 
            />
          </OfferBanner>

          {/* Products Grid */}
        <Grid container spacing={4}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={2.4} key={product._id}>
                <ProductCard>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image}
                  alt={product.name}
                />
                <CardContent>
                    <Typography variant="h5" gutterBottom sx={{ fontSize: '1.8rem', fontWeight: 'bold' }}>
                    {product.name}
                  </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2, fontSize: '1.2rem' }}>
                    {product.description}
                  </Typography>
                    <Typography variant="h5" color="primary" fontWeight="bold" sx={{ fontSize: '1.8rem' }}>
                      ₹{product.price}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="large" 
                    variant="contained"
                      fullWidth
                      onClick={() => handleAddToCart(product)}
                      startIcon={<AddShoppingCartIcon />}
                      sx={{ 
                        py: 1.5,
                        fontSize: '1.3rem',
                        bgcolor: '#2e7d32',
                        '&:hover': { bgcolor: '#1b5e20' }
                      }}
                    >
                      Add 
                  </Button>
                </CardActions>
                </ProductCard>
            </Grid>
          ))}
        </Grid>

          {/* Reviews Section */}
          <ReviewsSection />
          
          {/* Add Review Button */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 6 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => setReviewFormOpen(true)}
              startIcon={<RecommendIcon />}
            >
              Write a Review
            </Button>
          </Box>
          
          {/* Review Dialog */}
          <ReviewDialog />
        
          {/* Cart Dialog */}
          <Dialog
            open={cartOpen}
            onClose={() => setCartOpen(false)}
            maxWidth="md"
            fullWidth
            PaperProps={{
              sx: { borderRadius: '16px' }
            }}
          >
            <DialogTitle sx={{ pb: 2, pt: 3, px: 4 }}>
              <Typography variant="h4" fontWeight={600}>
                Shopping Cart
              </Typography>
            </DialogTitle>
            <DialogContent sx={{ p: 4 }}>
              <CartDialog>
                {/* User Details Form */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
                    Delivery Details
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                      fullWidth
                      label="Your Name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      sx={{ 
                        '& .MuiInputBase-input': { 
                          fontSize: '1.2rem',
                          padding: '15px'
                        }
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Your Email"
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      sx={{ 
                        '& .MuiInputBase-input': { 
                          fontSize: '1.2rem',
                          padding: '15px'
                        }
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Mobile Number"
                      value={userMobile}
                      onChange={(e) => setUserMobile(e.target.value)}
                      error={!!userDetailsError}
                      helperText={userDetailsError}
                      sx={{ 
                        '& .MuiInputBase-input': { 
                          fontSize: '1.2rem',
                          padding: '15px'
                        }
                      }}
                    />
                    {userDetailsError && (
                      <Typography color="error" variant="body2">
                        {userDetailsError}
              </Typography>
                    )}
                  </Box>
                </Box>

                {/* Cart Items */}
                {cart.map((item) => (
                  <Box 
                    key={item.name} 
                    className="cart-item"
                  >
                    <img src={item.image} alt={item.name} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ mb: 1, fontSize: '1.4rem' }}>
                        {item.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.3rem' }}>
                  Quantity: 
                        </Typography>
                        <Select
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.name, e.target.value)}
                          size="small"
                          sx={{ ml: 2, minWidth: 90, fontSize: '1.3rem' }}
                        >
                          {[1, 2, 3, 4, 5].map((num) => (
                            <MenuItem key={num} value={num}>
                              {num}
                            </MenuItem>
                          ))}
                        </Select>
                <Button 
                          onClick={() => handleRemoveFromCart(item.name)}
                        color="error"
                          startIcon={<DeleteIcon />}
                          sx={{ ml: 2, fontSize: '1.2rem' }}
                >
                  Remove
                </Button>
                      </Box>
                      <Typography variant="h6" color="primary" fontWeight="bold" sx={{ fontSize: '1.4rem' }}>
                        ₹{item.price * item.quantity}
                      </Typography>
                    </Box>
                  </Box>
                ))}

                <Box className="total-section">
                  <Typography variant="h4" sx={{ mb: 3 }}>
                    Total: ₹{cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}
              </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handlePlaceOrder}
                    sx={{ 
                      py: 2,
                      fontSize: '1.4rem',
                      borderRadius: '12px'
                    }}
                  >
                    Place Order
                  </Button>
                </Box>
              </CartDialog>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setCartOpen(false)}>Close</Button>
              <Button variant="contained" color="primary">
                Checkout
              </Button>
            </DialogActions>
          </Dialog>

          {renderAnalytics()}

          <ToastContainer 
            position="top-center"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            style={{
              top: '40px',
              fontSize: '1.3rem',
              fontWeight: '500',
              textAlign: 'center',
              width: 'auto',
              minWidth: '300px'
            }}
            toastStyle={{
              background: '#2e7d32',
              borderRadius: '12px',
              padding: '16px'
            }}
          />
        </Container>
      </Box>
    </ThemeProvider>
  );
}
