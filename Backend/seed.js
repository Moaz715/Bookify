// seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Book = require('./models/Book'); 
const User = require('./models/User'); 
const Order = require('./models/Order');

const MONGO_URI = process.env.MONGO_URI; 

const seedDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("📦 Connected to Database. Wiping old data...");

        await Order.deleteMany({});
        await Book.deleteMany({});
        await User.deleteMany({});

        // ==========================================
        // 1. CREATE USERS
        // ==========================================
        const hashedPass = await bcrypt.hash('Password123!', 10);
        
        const usersToInsert = [
            { email: 'moaz@bookify.com', password: hashedPass, role: 'admin' },
            { email: 'student@eng.asu.edu', password: hashedPass, role: 'user' },
            { email: 'developer@test.com', password: hashedPass, role: 'user' },
            { email: 'tester@test.com', password: hashedPass, role: 'user' },
            { email: 'alice@bookify.com', password: hashedPass, role: 'user' },
            { email: 'bob@bookify.com', password: hashedPass, role: 'user' },
            { email: 'charlie@bookify.com', password: hashedPass, role: 'user' },
            { email: 'data.scientist@test.com', password: hashedPass, role: 'user' },
            { email: 'embedded.dev@test.com', password: hashedPass, role: 'user' },
            { email: 'qa.lead@test.com', password: hashedPass, role: 'user' }
        ];

        const createdUsers = await User.insertMany(usersToInsert);
        const regularUsers = createdUsers.filter(u => u.role === 'user');
        console.log(`👥 Inserted ${createdUsers.length} total users!`);

        // ==========================================
        // 2. CREATE BOOKS (Mapped to Major Fields)
        // ==========================================
        const bookCover = "https://res.cloudinary.com/dj2zlztxa/image/upload/v1775568963/bookify_images/utf9x1scrvxsmg0gggwb.jpg";

        const bookData = [
            { title: "FairPlayAi: Automated Sports Analytics", author: "Computer Vision Labs", genre: "Technology", price: 55.00, stock: 12, description: "Detecting football fouls and disciplinary actions using Multiscale Vision Transformers (MViT).", image: bookCover },
            { title: "Deep Learning with PyTorch", author: "Eli Stevens", genre: "Technology", price: 45.00, stock: 15, description: "Build deep neural networks and custom training loops from scratch.", image: bookCover },
            { title: "Preventing Data Leakage in ML", author: "Data Science Team", genre: "Science", price: 38.00, stock: 20, description: "The right way to apply SMOTE during cross-validation.", image: bookCover },
            { title: "Feature Engineering for Kaggle", author: "Corey Wade", genre: "Science", price: 42.00, stock: 18, description: "Winning strategies for the Ames Housing and Heart Disease competitions.", image: bookCover },
            { title: "Grid Dataset Processing", author: "Vision Research", genre: "Technology", price: 29.99, stock: 8, description: "Handling rotated squares in a grid format for spatial relationship modeling.", image: bookCover },
            
            { title: "ARM Cortex-M Architecture", author: "Joseph Yiu", genre: "Engineering", price: 65.00, stock: 5, description: "Deep dive into TM4C123GH6PM register mapping and SysTick interrupt handlers.", image: bookCover },
            { title: "Real-Time Embedded Systems", author: "Colin Walls", genre: "Engineering", price: 55.50, stock: 8, description: "A complete guide to FreeRTOS and context switching logic.", image: bookCover },
            { title: "Networking Architectures", author: "James Kurose", genre: "Engineering", price: 75.00, stock: 14, description: "Analyzing crossbar switch diagrams and packet queues.", image: bookCover },
            
            { title: "React & Express Middleware", author: "Fullstack Academy", genre: "Technology", price: 34.00, stock: 30, description: "Mastering API fetching, routing, and middleware execution order.", image: bookCover },
            { title: "Dynamic PHP & SQL", author: "Jon Duckett", genre: "Technology", price: 32.50, stock: 0, description: "Dynamic form generation and relational database management.", image: bookCover },
            { title: "Building Payment Gateways", author: "Stripe Docs", genre: "Technology", price: 15.00, stock: 50, description: "Integrating Stripe checkout sessions securely in sandbox environments.", image: bookCover },
            
            { title: "MoSCoW Prioritization", author: "Agile Alliance", genre: "Technology", price: 22.00, stock: 10, description: "Drafting effective user stories for stakeholders and product owners.", image: bookCover },
            { title: "Automated UI Testing", author: "Mark Winteringham", genre: "Technology", price: 24.50, stock: 12, description: "Rigorous software testing using Selenium for banking system simulations.", image: bookCover },
            { title: "Unit Testing with JUnit", author: "Kent Beck", genre: "Technology", price: 28.00, stock: 4, description: "Achieving high branch coverage and detailed analysis reports.", image: bookCover },
            { title: "Python for Data Cleaning", author: "Paul Crickard", genre: "Science", price: 35.00, stock: 25, description: "Using Pandas to automate inventory grouping.", image: bookCover },
            
            { title: "Clean Code", author: "Robert C. Martin", genre: "Technology", price: 35.00, stock: 2, description: "A Handbook of Agile Software Craftsmanship.", image: bookCover },
            { title: "The Pragmatic Programmer", author: "Andrew Hunt", genre: "Technology", price: 40.00, stock: 7, description: "From journeyman to master.", image: bookCover },
            { title: "Dune", author: "Frank Herbert", genre: "Sci-Fi", price: 18.99, stock: 0, description: "A sci-fi epic set on the desert planet Arrakis.", image: bookCover },
            { title: "The Martian", author: "Andy Weir", genre: "Sci-Fi", price: 14.99, stock: 45, description: "Survival on Mars using science and engineering.", image: bookCover },
            { title: "Design Patterns", author: "Gang of Four", genre: "Technology", price: 50.00, stock: 10, description: "Elements of Reusable Object-Oriented Software.", image: bookCover },
            { title: "Refactoring", author: "Martin Fowler", genre: "Technology", price: 45.00, stock: 3, description: "Improving the Design of Existing Code.", image: bookCover },
            { title: "Introduction to Algorithms", author: "Thomas H. Cormen", genre: "Technology", price: 85.00, stock: 15, description: "Comprehensive coverage of algorithms and data structures.", image: bookCover },
            { title: "Structure and Interpretation", author: "Harold Abelson", genre: "Technology", price: 60.00, stock: 6, description: "A classic text on computer programming concepts.", image: bookCover },
            { title: "Code Complete", author: "Steve McConnell", genre: "Technology", price: 42.00, stock: 9, description: "A Practical Handbook of Software Construction.", image: bookCover },
            { title: "The Mythical Man-Month", author: "Frederick P. Brooks Jr.", genre: "Technology", price: 25.00, stock: 20, description: "Essays on Software Engineering.", image: bookCover },
            { title: "Head First Design Patterns", author: "Eric Freeman", genre: "Technology", price: 38.00, stock: 11, description: "A Brain-Friendly Guide.", image: bookCover },
            { title: "Grokking Algorithms", author: "Aditya Bhargava", genre: "Technology", price: 30.00, stock: 22, description: "An illustrated guide for programmers.", image: bookCover },
            { title: "Eloquent JavaScript", author: "Marijn Haverbeke", genre: "Technology", price: 28.00, stock: 14, description: "A Modern Introduction to Programming.", image: bookCover },
            { title: "You Don't Know JS", author: "Kyle Simpson", genre: "Technology", price: 22.00, stock: 16, description: "Up & Going.", image: bookCover },
            { title: "Continuous Delivery", author: "Jez Humble", genre: "Technology", price: 48.00, stock: 8, description: "Reliable Software Releases through Build Automation.", image: bookCover },
            { title: "Site Reliability Engineering", author: "Betsy Beyer", genre: "Engineering", price: 52.00, stock: 13, description: "How Google Runs Production Systems.", image: bookCover },
            { title: "Designing Data-Intensive Apps", author: "Martin Kleppmann", genre: "Technology", price: 58.00, stock: 19, description: "Reliable, Scalable, and Maintainable Systems.", image: bookCover },
            { title: "Microservices Patterns", author: "Chris Richardson", genre: "Technology", price: 49.00, stock: 7, description: "With examples in Java.", image: bookCover },
            { title: "Kubernetes Up & Running", author: "Kelsey Hightower", genre: "Engineering", price: 44.00, stock: 10, description: "Dive into the Future of Infrastructure.", image: bookCover },
            { title: "Neuromancer", author: "William Gibson", genre: "Sci-Fi", price: 16.99, stock: 5, description: "The definitive cyberpunk novel.", image: bookCover }
        ];

        const createdBooks = await Book.insertMany(bookData);
        console.log(`📚 Inserted ${createdBooks.length} books successfully!`);

        // ==========================================
        // 3. CREATE ORDERS
        // ==========================================
        const statuses = ["Processing", "Delivered", "Cancelled"];
        const ordersToInsert = [];

        for (let i = 0; i < 30; i++) {
            const randomUser = regularUsers[Math.floor(Math.random() * regularUsers.length)];
            const numItems = Math.floor(Math.random() * 3) + 1; 
            const items = [];
            let totalAmount = 0;

            for (let j = 0; j < numItems; j++) {
                const randomBook = createdBooks[Math.floor(Math.random() * createdBooks.length)];
                const qty = Math.floor(Math.random() * 3) + 1; 
                
                if (!items.some(item => item.bookId === randomBook._id)) {
                    items.push({
                        bookId: randomBook._id,
                        quantity: qty,
                        priceAtPurchase: randomBook.price
                    });
                    totalAmount += (randomBook.price * qty);
                }
            }

            if (items.length > 0) {
                ordersToInsert.push({
                    userId: randomUser._id,
                    items: items,
                    totalAmount: parseFloat(totalAmount.toFixed(2)),
                    status: statuses[Math.floor(Math.random() * statuses.length)],
                    stripePaymentId: `cs_test_mock_${Math.random().toString(36).substring(2, 15)}`
                });
            }
        }

        const createdOrders = await Order.insertMany(ordersToInsert);
        console.log(`📦 Inserted ${createdOrders.length} dynamic orders successfully!`);

        console.log("✅ Seeding Complete!");
        process.exit(0);

    } catch (error) {
        console.error("❌ Seeding Failed:", error);
        process.exit(1);
    }
};

seedDatabase();