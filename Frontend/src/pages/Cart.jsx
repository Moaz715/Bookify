import { useCartContext } from "../hooks/useCartContext";
import { useAuthContext } from "../hooks/useAuthContext";
import {useState} from "react";
import CartCard from "../components/CartCard";
import '../styles/Home.css';

const Cart = () => {
    const { cart, dispatch } = useCartContext();
    const {user} = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);


    const grandTotal = cart.reduce((sum, book) => {
        return sum + (book.price * book.quantity);
    }, 0);

    const checkout = async () => {
        setIsLoading(true);
        alert('gay')
        const formattedItems = cart.map(item => ({
            bookId: item._id,
            quantity: item.quantity,
            priceAtPurchase: item.price
        }));

        const res = await fetch('/api/orders/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}` 
            },
            body: JSON.stringify({
                items: formattedItems,
                totalAmount: grandTotal,
            })
        });
        const json = await res.json();
        if (res.ok) {
            dispatch({ type: 'CLEAR' }); 
            alert("Order placed successfully!");
        } else {
            alert(json.error);
        }
        setIsLoading(false);
    }
    

    return (
        <div className="cart-page">
            <h2>Your Cart</h2>
            {cart.length === 0 ? (
                <p>Your cart is totally empty. Go browse some books!</p>
            ) : (
                <>
                    <div className="books-grid">
                        {cart.map((book) => (
                            <CartCard key={book._id} book={book} />
                        ))}
                    </div>
                    <div className="cart-summary" style={{ marginTop: '40px', textAlign: 'right' }}>
                        <h3>Grand Total: ${grandTotal.toFixed(2)}</h3>
                        <button onClick={checkout} disabled={isLoading} style={{ padding: '10px 20px', fontSize: '1.2rem', marginTop: '10px', backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: '4px' }}>
                            Proceed to Checkout
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default Cart;