import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BookCard from "../components/BookCard";
import '../styles/Home.css';
import { toast } from 'react-toastify';
import api from "../utils/api";

const Home = () => {
    const [books, setBooks] = useState([]);

    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('None');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        const getBooks = async () => {
            try {
                const res = await api.get(`/api/books?page=${page}&filter=${filter}&search=${search}`);

                if (page === 1) {
                    setBooks(res.data);
                } else {
                    setBooks(prevBooks => [...prevBooks, ...res.data]);
                }

                if (res.data.length < 8) {
                    setHasMore(false);
                }else{
                    setHasMore(true);
                }
            } catch (error) {
                console.error("Failed to fetch books:", error);
            }
        }
        getBooks();
    }, [page, filter, search]);

    const handleNewSearch = () => {
        setSearch(searchInput);
        setPage(1);
    };

    return (
        <div className="home">
            <h2>Browse Our Collection</h2>

            <div className="store-controls">
                <div className="search-bar-wrapper">
                    <input
                        type="text"
                        placeholder="Search books by title..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleNewSearch();
                        }}
                    />
                    <button className="search-btn" onClick={handleNewSearch}>
                        Search
                    </button>
                </div>

                <select
                    value={filter}
                    onChange={(e) => {
                        setFilter(e.target.value);
                        setPage(1);
                    }}
                >
                    <option value="None">All Genres</option>
                    <option value="Fiction">Fiction</option>
                    <option value="Non-Fiction">Non-Fiction</option>
                    <option value="Sci-Fi">Sci-Fi</option>
                    <option value="Fantasy">Fantasy</option>
                </select>
            </div>

            <div className="books-grid">
                {books.length === 0 && <p className="no-results">No books found matching your criteria.</p>}
                {books.map((book) => (
                    <BookCard key={book._id} book={book}>
                        <Link to={`/books/${book._id}`} className="view-details-btn">View Details</Link>
                    </BookCard>
                ))}
            </div>

            {books.length > 0 && hasMore && (
                <div className="load-more-wrapper">
                    <button
                        className="load-more-btn"
                        onClick={() => setPage(prev => prev + 1)}
                    >
                        Load More Books
                    </button>
                </div>
            )}

            {books.length > 0 && !hasMore && (
                <p className="end-of-list-msg">You've reached the end of the catalog!</p>
            )}
        </div>
    );
}

export default Home;