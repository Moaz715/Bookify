import { Link } from 'react-router-dom';
import '../styles/Cards.css';

const BookCard = ({ book }) => {
    return (
        <div className="book-card">
            <img
                src={book.image}
                alt={`Cover of ${book.title}`}
                className="book-image"
            />
            <div className="book-info">
                <h4>{book.title}</h4>
                <p className="author">By {book.author}</p>
                <p className="price">${book.price}</p>
                <Link to={`/books/${book._id}`} className="details-btn">
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default BookCard;