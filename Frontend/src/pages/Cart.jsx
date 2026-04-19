import { useCartContext } from "../hooks/useCartContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";
import { useState } from "react";
import CartCard from "../components/CartCard";
import '../styles/Home.css';
import { toast } from 'react-toastify';
import api from '../utils/api';

const Cart = () => {
    const { cart, dispatch } = useCartContext();
    const { user } = useAuthContext();
    const { logout } = useLogout();
    const [isLoading, setIsLoading] = useState(false);


    const grandTotal = cart.reduce((sum, book) => {
        return sum + (book.price * book.quantity);
    }, 0);

    const checkout = async () => {
        setIsLoading(true);

        if (!user || !user.token) {
            toast.error("Please log in to checkout.");
            navigate('/login');
            setIsLoading(false);
            return;
        }

        const formattedItems = cart.map(item => ({
            bookId: item._id,
            quantity: item.quantity
        }));

        try {
            const res = await api.post('/api/payment/create-checkout-session', { items: formattedItems });

            if (res.data.url) {
                localStorage.setItem('pendingOrder', JSON.stringify(formattedItems));
                window.location.href = res.data.url;
            }
        } catch (error) {
            const errorMsg = error.response?.data?.error || "Checkout failed.";
            toast.error(errorMsg);
            setIsLoading(false);
        }
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