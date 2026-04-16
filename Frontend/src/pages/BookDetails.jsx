import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCartContext } from "../hooks/useCartContext";
import '../styles/BookDetails.css';
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import ReviewForm from "../components/ReviewForm";
import { toast } from 'react-toastify';

const BookDetails = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [qty, setQty] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const { dispatch } = useCartContext();
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [editReviewId, setEditReviewId] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true); 

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
            setReviews([json.review, ...reviews]);
            setBook(prev => ({
                ...prev,
                totalReviews: json.totalBookReviews,
                averageRating: json.averageRating
            }));
            toast.success("Review posted!");
        } else {
            toast.error(json.error);
        }
    }


    const handleEditReview = async (reviewId, updatedContent, updatedRating) => {
        console.log("FRONTEND: 1. Sending PUT request for review:", reviewId);

        const res = await fetch(`/api/reviews/${reviewId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({ description: updatedContent, rating: updatedRating })
        });

        console.log("FRONTEND: 2. Server responded with status:", res.status);

        const json = await res.json();
        console.log("FRONTEND: 3. Server JSON data:", json);

        if (res.ok) {
            console.log("FRONTEND: 4. res.ok is TRUE! Updating state now...");

            setReviews(prev => prev.map(r => r._id === reviewId ? json.review : r));
            setBook(prev => ({
                ...prev,
                averageRating: json.averageRating
            }));

            console.log("FRONTEND: 5. Closing the form...");
            setEditReviewId(null);
        } else {
            console.error("FRONTEND: 4. res.ok is FALSE! Something failed.");
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
            const json = await res.json();
            setReviews(prev => prev.filter(r => r._id !== reviewId));
            setBook(prev => ({
                ...prev,
                totalReviews: json.totalBookReviews,
                averageRating: json.averageRating
            }));
            toast.success("Review deleted!");
        } else {
            toast.error("Failed to delete Review");
        }
    }


    const handleAddToCart = () => {
        if (!user) {
            toast.info("Please log in to add items to your cart.");
            navigate('/login');
            return;
        }
        dispatch({
            type: 'ADD_BOOK',
            payload: { ...book, quantity: qty }
        });
        toast.success(`${book.title} added to cart!`);
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
                if(page === 1){
                    setReviews(json2);
                }else{
                    setReviews(prevReviews => [...prevReviews, ...json2]);
                }
                if(json.length > 5){
                    setHasMore(true);
                }else{
                    setHasMore(false);
                }
                
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
                <div className="book-meta">
                    <p><strong>Genre:</strong> {book.genre}</p>
                    <p><strong>Availability:</strong> {book.stock > 0 ? `${book.stock} in stock` : <span style={{ color: 'red' }}>Out of Stock</span>}</p>
                    <p><strong>Reviews:</strong> ⭐ {book.averageRating} / 5 ({book.totalReviews} total)</p>
                </div>
                {user && user.role !== 'admin' && (
                    <>
                        <input type="number" min="1" max={book.stock} value={qty} onChange={(e) => setQty(Number(e.target.value))} />
                        <button onClick={handleAddToCart}>Add to Cart</button>
                    </>
                )}
            </div>
            {user && user.role !== 'admin' && (
                <div className="review-form-container">
                    <h3>Leave a Review</h3>
                    <ReviewForm onSubmit={handleCreateReview} onCancel={null} />
                </div>
            )}
            <div className="book-reviews">
                <h3>Reviews</h3>
                {reviews && reviews.length === 0 && <p>No reviews yet.</p>}
                {reviews && reviews.map(review => (
                    <div key={review._id} className="review">
                        {editReviewId === review._id ? (
                            <ReviewForm initialContent={review.description} initialRating={review.rating} onSubmit={(newContent, newRating) => handleEditReview(review._id, newContent, newRating)} onCancel={() => setEditReviewId(null)} buttonText="Edit Review" />
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
                                {user && user.email === review.userId.email && (
                                    <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                                        <button onClick={() => setEditReviewId(review._id)}>Edit</button>
                                        <button onClick={() => handleDeleteReview(review._id)}>Delete</button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                ))}
                {reviews && reviews.length > 0 && hasMore && (
                    <div className="load-more-wrapper">
                        <button
                            className="load-more-btn"
                            onClick={() => setPage(prev => prev + 1)}
                        >
                            Load More Reviews
                        </button>
                    </div>)}
            </div>
        </div>
    );
}

export default BookDetails;