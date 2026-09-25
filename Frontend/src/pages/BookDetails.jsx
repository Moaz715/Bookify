import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCartContext } from "../hooks/useCartContext";
import { useAuthContext } from "../hooks/useAuthContext";
import ReviewForm from "../components/ReviewForm";
import { toast } from 'react-toastify';
import api from "../utils/api";
import '../styles/BookDetails.css';

const BookDetails = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [qty, setQty] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    const { addItem } = useCartContext();
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [editReviewId, setEditReviewId] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const handleCreateReview = async (reviewContent, reviewRating) => {
        if (!user) return navigate('/login');
        try {
            const res = await api.post(`/api/books/${id}/reviews`, {
                description: reviewContent,
                rating: reviewRating
            });
            setReviews([res.data.review, ...reviews]);
            setBook(prev => ({ ...prev, totalReviews: prev.totalReviews + 1 }));
            toast.success("Review posted!");
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to post review");
        }
    }

    const handleEditReview = async (reviewId, updatedContent, updatedRating) => {
        try {
            const res = await api.put(`/api/reviews/${reviewId}`, {
                description: updatedContent,
                rating: updatedRating
            });
            setReviews(prev => prev.map(r => r._id === reviewId ? res.data.review : r));
            setEditReviewId(null);
            toast.success("Review updated!");
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to update review");
        }
    }

    const handleDeleteReview = async (reviewId) => {
        try {
            await api.delete(`/api/reviews/${reviewId}`);
            setReviews(prev => prev.filter(r => r._id !== reviewId));
            setBook(prev => ({ ...prev, totalReviews: prev.totalReviews - 1 }));
            toast.success("Review deleted!");
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to delete review");
        }
    }

    const handleAddToCart = () => {
        if (!user) {
            toast.info("Please log in to add items to your cart.");
            navigate('/login');
            return;
        }
        addItem({ ...book, quantity: qty });
        toast.success(`${book.title} added to cart!`);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (page === 1) {
                    const [bookRes, reviewsRes] = await Promise.all([
                        api.get(`/api/books/${id}`),
                        api.get(`/api/books/${id}/reviews?page=${page}`)
                    ]);

                    setBook(bookRes.data);
                    setReviews(reviewsRes.data);
                    setIsLoading(false);
                    setHasMore(reviewsRes.data.length === 10);
                } else {
                    const reviewsRes = await api.get(`/api/books/${id}/reviews?page=${page}`);
                    setReviews(prev => [...prev, ...reviewsRes.data]);
                    setHasMore(reviewsRes.data.length === 10);
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
                toast.error("Failed to load data");
            }
        };
        
        fetchData();
    }, [id, page]);

    if (isLoading) return <div>Loading book details...</div>;
    if (!book) return <div>Book not found.</div>;

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
                    <p><strong>Reviews:</strong> {book.totalReviews} total</p>
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
                                <p className="review-text"><strong>{review.userId?.email || 'Unknown User'}</strong></p>
                                <p className="review-text">"{review.description}"</p>
                                <p className="review-meta">
                                    <strong>Rating: {review.rating}/5</strong>
                                    <span style={{ color: '#6b7280', fontSize: '0.85rem', marginLeft: '10px' }}>
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </span>
                                </p>
                                {user && review.userId && user.email === review.userId.email && (
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