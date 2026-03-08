import { useCartContext } from "../hooks/useCartContext";
import '../styles/Cards.css';

const CartCard = ({ book }) => {
    const { dispatch } = useCartContext();
    
    const handleInc = () => {
        dispatch({ type: 'INCREMENT', payload: book });
    }
    
    const handleDec = () => {
        dispatch({ type: 'DECREMENT', payload: book });
    }
    
    const handleRemove = () => {
        dispatch({ type: 'REMOVE_BOOK', payload: book });
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