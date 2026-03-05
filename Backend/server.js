require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bookRoutes = require('./routes/bookRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const app = express();

app.use(cors()); 
app.use(express.json()); 


app.use('/api/books', bookRoutes);
app.use('/api/books/:bookId/reviews', reviewRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users/', userRoutes);
app.use('/api/orders/', orderRoutes);


app.use((err, req, res, next) => {
    console.error("Error caught by Global Handler:", err.message);
    
    
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong on the server";

    res.status(statusCode).json({
        success: false,
        message: message,
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