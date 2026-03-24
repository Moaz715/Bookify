import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import BookCard from "../components/BookCard";
import "../styles/ManageBooks.css";

const ManageBooks = () => {
    const [books, setBooks] = useState(null);
    const [error, setError] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState('None');
    const [page, setPage] = useState(1);
    const { user } = useAuthContext();

    useEffect(() => {
        const fetchBooks = async () => {
            const res = await fetch(`/api/books?page=${page}&filter=${filter}&search=${search}`);
            const json = await res.json();

            if (res.ok) {
                setBooks(json);
            } else {
                alert(json.error);
            }
        };
        fetchBooks();
    }, [page, filter, search]);

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
            
            <div className="admin-controls">
                <div className="search-bar-wrapper">
                    <input
                        type="text"
                        placeholder="Search books by title..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                setSearch(searchInput);
                                setPage(1);
                            }
                        }}
                    />
                    <button
                        className="search-btn"
                        onClick={() => {
                            setSearch(searchInput);
                            setPage(1);
                        }}
                    >
                        Search
                    </button>
                </div>
                <select
                    value={filter}
                    onChange={(e) => { setFilter(e.target.value); setPage(1); }}
                >
                    <option value="None">All Genres</option>
                    <option value="Fiction">Fiction</option>
                    <option value="Non-Fiction">Non-Fiction</option>
                    <option value="Sci-Fi">Sci-Fi</option>
                    <option value="Fantasy">Fantasy</option>
                </select>
            </div>
            
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
            
            {books && (
                <div className="pagination-controls">
                    <button 
                        className="page-btn" 
                        disabled={page === 1} 
                        onClick={() => setPage(prev => prev - 1)}
                    >
                        Previous
                    </button>
                    <span className="page-indicator">Page {page}</span>
                    <button 
                        className="page-btn" 
                        disabled={books.length < 10} 
                        onClick={() => setPage(prev => prev + 1)}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}

export default ManageBooks;