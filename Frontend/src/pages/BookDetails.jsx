import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCartContext } from "../hooks/useCartContext";
import '../styles/BookDetails.css';
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import ReviewForm from "../components/ReviewForm";

const BookDetails = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [reviews, setReviews] = useState(null);
    const [qty, setQty] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const { dispatch } = useCartContext();
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [editReviewId, setEditReviewId] = useState(null);

    const handleCreateReview = async (reviewContent, reviewRating) => {
        if (!user) {
            navigate('/login');
            return;
        }

        const res = await fetch(`/api/books/${id}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({ description: reviewContent, rating: reviewRating })
        })

        const json = await res.json();

        if (res.ok) {
            setReviews([json, ...reviews]);
            setError(null);
        } else {
            setError(json.error);
        }
    }


    const handleEditReview = async (reviewId, updatedContent, updatedRating) => {
        const res = await fetch(`/api/reviews/${reviewId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({ description: updatedContent, rating: updatedRating })
        });

        const json = await res.json();

        if (res.ok) {
            setReviews(prev => prev.map(r => r._id === reviewId ? json : r));
            setEditReviewId(null);
            setError(null);
        } else {
            setError(json.error);
        }
    }


    const handleDeleteReview = async (reviewId) => {
        const res = await fetch(`/api/reviews/${reviewId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        });

        if (res.ok) {
            setReviews(prev => prev.filter(r => r._id !== reviewId));
        } else {
            setError("Failed to delete Review");
        }
    }


    const handleAddToCart = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        dispatch({
            type: 'ADD_BOOK',
            payload: { ...book, quantity: qty }
        });
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
                <input type="number" min="1" value={qty} onChange={(e) => setQty(Number(e.target.value))} />
                <button onClick={handleAddToCart}>Add to Cart</button>
            </div>
            <div className="review-form-container">
                <h3>Leave a Review</h3>
                {error && <div className="error">{error}</div>}
                <ReviewForm onSubmit={handleCreateReview} onCancel={null} />
            </div>
            <div className="book-reviews">
                <h3>Reviews</h3>
                {reviews && reviews.length === 0 && <p>No reviews yet.</p>}
                {reviews && reviews.map(review => (
                    <div key={review._id} className="review">
                        {editReviewId === review._id ? (
                            <ReviewForm initialContent={review.description} initialRating={review.rating} onSubmit={(newContent, newRating)=>handleEditReview(review._id, newContent, newRating)} onCancel={()=>setEditReviewId(null)} buttonText="Edit Review" />
                        ) : (
                            <>
                                <p className="review-text"><strong>{review.userId.email}</strong></p>
                                <p className="review-text">"{review.description}"</p>
                                <p className="review-meta">
                                    <strong>Rating: {review.rating}/5</strong>
                                    <span style={{ color: '#6b7280', fontSize: '0.85rem', marginLeft: '10px' }}>
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </span>
                                </p>
                                <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                                    <button onClick={() => setEditReviewId(review._id)}>Edit</button>
                                    <button onClick={() => handleDeleteReview(review._id)}>Delete</button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BookDetails;