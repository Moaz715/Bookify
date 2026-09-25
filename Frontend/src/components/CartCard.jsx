import { useCartContext } from "../hooks/useCartContext";
import '../styles/Cards.css';

const CartCard = ({ book }) => {
    const { increment, decrement, removeItem } = useCartContext();
    
    const handleInc = () => {
        increment(book._id);
    }
    
    const handleDec = () => {
        decrement(book._id);
    }
    
    const handleRemove = () => {
        removeItem(book._id);
    }

    return (
        <div className="book-card">
            <img src={book.image} alt={book.title} className="book-image" />
            <div className="book-info">
                <h4>{book.title}</h4>
                <p className="author">By {book.author}</p>
                <p className="price">${book.price}</p>
                
                <span>
                    <button onClick={handleDec}>-</button>
                    <span className="quantity-display"> {book.quantity} </span>
                    <button onClick={handleInc}>+</button>
                </span>
                
                <button onClick={handleRemove}>Remove</button>
            </div>
        </div>
    );
};

export default CartCard;