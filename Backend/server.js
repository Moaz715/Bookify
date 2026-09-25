require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bookRoutes = require('./routes/bookRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const app = express();

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true
})); 
app.use(express.json()); 
app.use(cookieParser());


app.use('/api/books', bookRoutes);
app.use('/api/books/:bookId/reviews', reviewRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);


app.use((err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Something went wrong on the server";

    if (err.name === 'ValidationError' || message.includes('Password') || message.includes('Email')) {
        statusCode = 400;
    }
    
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token. Please log in again.';
    }

    
    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Your session has expired. Please log in again.';
    }

    res.status(statusCode).json({
        success: false,
        error: message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

const PORT = process.env.PORT || 5000;
const URI = process.env.MONGO_URI;

mongoose.connect(URI)
  .then(() => {
    console.log('Connected to MongoDB successfully!');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
  });