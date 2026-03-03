// backend/controllers/bookController.js
const Book = require('../models/Book');

module.exports.index = async (req, res, next) => {
    const books = await Book.find({});
    res.status(200).json(books);
};

module.exports.getBook = async (req, res, next) => {
    const { id } = req.params;
    const book = await Book.findById(id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.status(200).json(book);
};

module.exports.createBook = async (req, res, next) => {
    const { title, authors, genre, price, image = "", description } = req.body;
    const newBook = await Book.create({ title, authors, genre, price, image, description });
    res.status(200).json(newBook);
};

module.exports.updateBook = async (req, res, next) => {
    const { id } = req.params;
    const { title, authors, genre, price, image = "", description } = req.body;
    
    const updatedBook = await Book.findByIdAndUpdate(id,
        { title, authors, genre, price, image, description },
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