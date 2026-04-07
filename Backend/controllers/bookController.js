const Book = require('../models/Book');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports.index = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page-1) * limit;
    const filter = req.query.filter || 'None';
    const search = req.query.search || '';

    let query = {};
    if(filter !== 'None'){
        query.genre = filter;
    }

    if(search){
        query.title = {$regex: search, $options: 'i'};
    }

    const books = await Book.find(query).skip(skip).limit(limit);
    res.status(200).json(books);
};

module.exports.getBook = async (req, res) => {
    const { id } = req.params;
    const book = await Book.findById(id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.status(200).json(book);
};

module.exports.createBook = async (req, res) => {

    const { title, author, description, price, genre, stock } = req.body;
    let imageUrl = '';

        
    if (req.file) {
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
            
            
        const result = await cloudinary.uploader.upload(dataURI, {
            folder: "bookify_images",
        });

            
        imageUrl = result.secure_url;
    }

        
    const book = await Book.create({
        title, author, description, price, genre, stock, image: imageUrl
    });

    res.status(201).json(book);
};

module.exports.updateBook = async (req, res) => {
    const { id } = req.params;
    const { title, authors, genre, price, stock, image = "", description } = req.body;
    
    const updatedBook = await Book.findByIdAndUpdate(id,
        { title, authors, genre, price, stock, image, description },
        { new: true, runValidators: true }
    );
    
    if(!updatedBook) return res.status(404).json({message: "Book not found"});
    res.status(200).json(updatedBook);
};

module.exports.deleteBook = async (req, res, next) => {
    const { id } = req.params;
    const deletedBook = await Book.findByIdAndDelete(id);
    if(!deletedBook) return res.status(404).json({message: "Book not found"});
    res.status(200).json(deletedBook);
};