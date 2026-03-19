const Book = require('../models/Book');

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
        query.search = {$regex: search, $options: 'i'};
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
    const { title, authors, genre, price, stock, image = "", description } = req.body;
    const newBook = await Book.create({ title, authors, genre, price, stock, image, description });
    res.status(200).json(newBook);
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