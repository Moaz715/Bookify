import { useState } from "react";
import "../styles/ReviewForm.css";
const ReviewForm = ({ 
    initialContent = "", 
    initialRating = 5, 
    onSubmit, 
    onCancel, 
    buttonText = "Submit Review" 
}) => {
    const [content, setContent] = useState(initialContent);
    const [rating, setRating] = useState(initialRating);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(content, rating);
        if (!onCancel) {
            setContent("");
            setRating(5);
        }
    };

    return (
        <form className="review-form" onSubmit={handleSubmit}>
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
            <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="submit-btn">{buttonText}</button>
                {onCancel && (
                    <button type="button" className="submit-btn" style={{ background: '#6b7280' }} onClick={onCancel}>
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}

export default ReviewForm;