import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BookCard from "../components/BookCard";
import '../styles/Home.css';

const Home = () => {
    const [books, setBooks] = useState(null);

    useEffect(() => {
        const getBooks = async () => {
            const res = await fetch('/api/books/', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            const json = await res.json();

            if (res.ok) {
                setBooks(json);
            }
        }
        getBooks();
    }, []);

    return (
        <div className="home">
            <h2>Home</h2>
            <div className="books-grid">
                {books && books.map((book) => (
                    <BookCard key={book._id} book={book}>
                        <Link to={`/books/${book._id}`}>View Details</Link>
                    </BookCard>
                ))}
            </div>
        </div>
    );
}

export default Home;