import { useState } from "react";
import "../styles/BookForm.css";

const BookForm = ({ initialBook = null, onSubmit, error }) => {

    const [title, setTitle] = useState(initialBook?.title || "");
    const [description, setDescription] = useState(initialBook?.description || "");
    const [stock, setStock] = useState(initialBook?.stock || 0);
    const [image, setImage] = useState(initialBook?.image || "");
    const [price, setPrice] = useState(initialBook?.price || 0);
    const [genre, setGenre] = useState(initialBook?.genre || "");
    const [author, setAuthor] = useState(initialBook?.author || "");
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            title, description, stock, image, price, genre, author
        });
    }

    return (
        <div className="book-form-container">
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit}>
                <label htmlFor="title">Title</label>
                <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                <label htmlFor="author">Author</label>
                <input type="text" id="author" value={author} onChange={(e) => setAuthor(e.target.value)} required />
                <label htmlFor="genre">Genre</label>
                <select id="genre" value={genre} onChange={(e) => setGenre(e.target.value)} required>
                    <option value="" disabled>Select a genre</option>
                    <option value="Fiction">Fiction</option>
                    <option value="Non-Fiction">Non-Fiction</option>
                    <option value="Sci-Fi">Sci-Fi</option>
                    <option value="Fantasy">Fantasy</option>
                    <option value="Mystery">Mystery</option>
                    <option value="Biography">Biography</option>
                </select>
                <label htmlFor="price">Price ($)</label>
                <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} step="0.01" required />
                <label htmlFor="stock">Stock</label>
                <input type="number" id="stock" value={stock} onChange={(e) => setStock(e.target.value)} required />
                <label htmlFor="image">Image</label>
                <input type="file" accept="image/*" id="image" onChange={(e) => setImage(e.target.files[0])} />
                <label htmlFor="description">Description</label>
                <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                <button type="submit">{initialBook ? "Update Book" : "Create Book"}</button>
            </form>
        </div>
    );
}

export default BookForm;