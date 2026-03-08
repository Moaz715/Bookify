import { useEffect, useState } from "react";
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
                    <BookCard key={book._id} book={book} />
                ))}
            </div>
        </div>
    );
}

export default Home;