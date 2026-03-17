import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import BookCard from "../components/BookCard";
import "../styles/ManageBooks.css";

const ManageBooks = () => {
    const [books, setBooks] = useState(null);
    const [error, setError] = useState(null);
    const { user } = useAuthContext();

    useEffect(() => {
        const fetchBooks = async () => {
            const res = await fetch('/api/books');
            const json = await res.json();

            if (res.ok) {
                setBooks(json);
            }
        };
        fetchBooks();
    }, []);

    const handleDelete = async (bookId) => {
        if (!window.confirm("Are you sure you want to delete this book?")) return;
        const res = await fetch(`/api/books/${bookId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });

        if (res.ok) {
            setBooks(prevBooks => prevBooks.filter(b => b._id !== bookId));
        } else {
            const json = await res.json();
            setError(json.error);
        }
    }

    return (
        <div className="manage-books-container">
            <h2>Manage Inventory</h2>
            {error && <div className="error">{error}</div>}
            <div className="books-grid">
                {books && books.map(book => (
                    <BookCard key={book._id} book={book}>
                        <div className="admin-actions">
                            <Link to={`/books/${book._id}`}>View Details</Link>
                            <Link to={`/admin/books/edit/${book._id}`} className="admin-edit-btn">
                                Edit
                            </Link>
                            <button onClick={() => handleDelete(book._id)} className="admin-delete-btn">
                                Delete
                            </button>
                        </div>
                    </BookCard>
                ))}
            </div>
        </div>
    );
}

export default ManageBooks;