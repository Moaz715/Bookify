import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const BookDetails = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBookDetails = async () => {
            const res = await fetch(`/api/books/${id}`);
            const json = await res.json();

            if (res.ok) {
                setBook(json);
                setIsLoading(false);
            }
        };

        fetchBookDetails();
    }, [id]);

    if (isLoading) return <div>Loading book details...</div>;

    return (
        <div className="book-details">
            <div className="book-main-info">
                <img src={book.image} alt={book.title} />
                <h2>{book.title}</h2>
                <p className="price">${book.price}</p>
                <p className="description">{book.description}</p>
                <input type="number" min="1" defaultValue="1" />
                <button>Add to Cart</button>
            </div>
            <div className="book-reviews">
                <h3>Reviews</h3>
                {book.reviews && book.reviews.map(review => (
                    <div key={review._id} className="review">
                        <p>{review.text}</p>
                        <p>Rating: {review.rating}/5</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BookDetails;