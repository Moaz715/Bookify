import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {useCartContext} from "../hooks/useCartContext";

const BookDetails = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [qty, setQty] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const {dispatch} = useContext(useCartContext);

    const handleAddToCart = () =>{
        dispatch({
            type: 'ADD_ITEM',
            payload: {...book, quantity: qty}
        });
    }

    useEffect(() => {
        const fetchBookDetails = async () => {
            const res = await fetch(`/books/${id}`);
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
                <input type="number" min="1" value={qty} onChange={(e)=>setQty(Number(e.target.value))}/>
                <button onClick={handleAddToCart}>Add to Cart</button>
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