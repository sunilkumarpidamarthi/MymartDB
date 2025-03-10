/**
 * Styled Components for Indian Grocery Mart
 * This file contains all the custom styled components using Material-UI's styled API
 */

import { styled } from '@mui/material/styles';
import { Box, Card, AppBar, Dialog, Button, Typography } from '@mui/material';

// Custom styled AppBar with white background and subtle shadow
export const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'rgba(0,0,0,0)',
  boxShadow: '0 3px 9px rgba(0,23,76,0.761)',
  transition: 'background-color 0.3s ease',
  '& .top-bar-container': {
    backgroundColor: 'forestgreen',
    padding: '1.3rem 2rem',
    marginBottom: '0.3rem',  // Space between bars
  },
  '& .notification-bar': {
    backgroundColor: 'orange',
    padding: '0.8rem',
    marginBottom: '1rem',  // Space between bars
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& .marquee': {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      width: '80%',
    },
  },
  '& .categories-bar-container': {
    backgroundColor: 'black',
    padding: '0.4rem 2rem',
    marginBottom: '0.4rem',  // Space between bars
  },
  '& .top-bar': {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  '& .search-container': {
    flex: 1,
    maxWidth: '800px',
    position: 'relative',
    margin: '0 auto',
    '& .MuiInputBase-root': {
      height: '65px',  // Increased height
      fontSize: '1.2rem',
    },
  },
  '& .cart-review-container': {
    display: 'flex',
    alignItems: 'center',
    gap: '12rem',
  },
  '& .categories-bar': {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    gap: '6rem',
    padding: '1rem 0',
  },
}));

// Category button with hover effect
export const CategoryButton = styled(Button)(({ theme }) => ({
  color: 'white',
  padding: '0.5rem 1.5rem',
  borderRadius: '25px',
  textTransform: 'none',
  fontSize: '1.6rem',
  fontWeight: 300,
  '&:hover': {
    backgroundColor: 'rgba(0, 255, 0, 0.2)',
  },
  '&.active': {
    backgroundColor: 'rgba(0, 255, 0, 0.3)',
  },
}));

// Product card with hover effects and responsive layout
export const ProductCard = styled(Card)(({ theme }) => ({
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.2s ease-in-out',
  borderRadius: '12px',
  overflow: 'hidden',
  backgroundColor: '#ffffff',
  margin: '0',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 20px rgba(0,0,0,0.15)',
  },
  '& .MuiCardMedia-root': {
    height: '380px',
    padding: '0.5rem',
    backgroundColor: '#f8f8f8',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  },
  '& .MuiCardContent-root': {
    flexGrow: 1,
    padding: '1.5rem',
  },
  '& .MuiCardActions-root': {
    padding: '1.5rem',
    marginTop: 'auto',
  },
}));

// Customer Reviews Container with animation
export const ReviewsContainer = styled(Box)(({ theme }) => ({
  marginTop: '2rem',
  marginBottom: '2rem',
  padding: '2rem',
  backgroundColor: '#f8f8f8',
  borderRadius: '16px',
  maxWidth: '2000px',
  margin: '0 auto',
  '& .review-header': {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  '& .reviews-list': {
    position: 'relative',
    minHeight: '200px',
    maxHeight: '400px',
    overflow: 'hidden',
    marginTop: '2rem',
    transition: 'all 0.5s ease-in-out',
  },
  '& .review-card': {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    opacity: 0,
    transform: 'translateY(20px)',
    transition: 'all 0.5s ease-in-out',
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    '&.visible': {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
}));

// Review Dialog
export const ReviewDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    width: '100%',
    maxWidth: '500px',
    padding: '2rem',
    borderRadius: '16px',
  },
  '& .dialog-title': {
    textAlign: 'center',
    marginBottom: '1.5rem',
  },
  '& .review-form': {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
}));

// Offer banner with hover effect
export const OfferBanner = styled(Box)(({ theme }) => ({
  height: '300px',
  width: '100%',
  overflow: 'hidden',
  position: 'relative',
  borderRadius: '16px',
  marginBottom: '2rem',
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease',
  },
  '&:hover img': {
    transform: 'scale(1.05)',
  },
}));

// Notification bar marquee
export const MarqueeText = styled(Typography)(({ theme }) => ({
  fontSize: '1.4rem',
  fontWeight: 500,
  color: 'black',
  animation: 'scrollText 20s linear infinite',
  '@keyframes scrollText': {
    '0%': { transform: 'translateX(100%)' },
    '100%': { transform: 'translateX(-100%)' },
  },
}));

// Cart dialog styling
export const CartDialog = styled(Box)(({ theme }) => ({
  '& .cart-item': {
    display: 'flex',
    gap: '3rem',
    padding: '1.1rem',
    borderRadius: '5px',
    backgroundColor: '#f8f8f8',
    '& img': {
      width: '190px',
      height: '150px',
      objectFit: 'contain',
      borderRadius: '8px',
    },
  },
  '& .total-section': {
    marginTop: '2rem',
    padding: '2rem',
    borderTop: '2px solid #eee',
  },
}));
