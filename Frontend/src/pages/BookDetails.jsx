import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCartContext } from "../hooks/useCartContext";
import '../styles/BookDetails.css';
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";

const BookDetails = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [reviews, setReviews] = useState(null);
    const [qty, setQty] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const { dispatch } = useCartContext();
    const {user} = useAuthContext();
    const navigate = useNavigate();
    const [content, setContent] = useState(""); 
    const [rating, setRating] = useState(5);   
    const [error, setError] = useState(null);

    

    const handleAddToCart = () =>{
        if(!user){
            navigate('/login');
            return;
        }
        dispatch({
            type: 'ADD_BOOK',
            payload: {...book, quantity: qty}
        });
    }

    const handleSubmitReview = async (e) =>{
        e.preventDefault();
        if(!user){
            navigate('/login');
            return;
        }

        const formData = {
            description: content,
            rating: rating
        } 

        const res = await fetch(`/api/books/${id}/reviews`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify(formData)
        })

        const json = await res.json();

        if(res.ok){
            
            setReviews([json, ...reviews]);
            setContent("");
            setRating(5);
            setError(null);
        }else{
            alert
            setError(json.error);
        }
    }

    useEffect(() => {
        const fetchBookDetails = async () => {
            const res1 = await fetch(`/api/books/${id}`);
            const res2 = await fetch(`/api/books/${id}/reviews`);

            
            if (res1.ok) {
                const json1 = await res1.json();
                setBook(json1);
                setIsLoading(false);
            }

            
            if (res2.ok) {
                const json2 = await res2.json();
                setReviews(json2);
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
                <p>{book.genre}</p>
                <p>{book.totalReviews}</p>
                <p>{book.averageRating}/5</p>
                <input type="number" min="1" value={qty} onChange={(e)=>setQty(Number(e.target.value))}/>
                <button onClick={handleAddToCart}>Add to Cart</button>
            </div>
            <div className="review-form-container">
                <h3>Leave a Review</h3>
                {error && <div className="error">{error}</div>}
                <form className="review-form" onSubmit={handleSubmitReview}>
                    <div className="form-group">
                        <label htmlFor="content">Your Review:</label>
                        <textarea 
                            name="content" 
                            id="content" 
                            rows="4"
                            value={content} 
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="rating">Rating (1-5):</label>
                        <input 
                            type="number" 
                            name="rating" 
                            id="rating" 
                            min="1" 
                            max="5"
                            value={rating} 
                            onChange={(e) => setRating(e.target.value)}
                            required
                            className="rating-input"
                        />
                    </div>
                    <button type="submit" className="submit-btn">
                        Submit Review
                    </button>
                </form>
            </div>
            <div className="book-reviews">
                <h3>Reviews</h3>
                {reviews && reviews.length === 0 && <p>No reviews yet.</p>}
                {reviews && reviews.map(review => (
                    <div key={review._id} className="review">
                        <p className="review-text"><strong>{review.userId.email}</strong></p>
                        <p className="review-text">"{review.description}"</p>
                        <p className="review-meta">
                            <strong>Rating: {review.rating}/5</strong> 
                            <span style={{ color: '#6b7280', fontSize: '0.85rem', marginLeft: '10px' }}>
                                {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BookDetails;