import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useCartContext } from "../hooks/useCartContext";
import api from "../utils/api";
import { toast } from "react-toastify";
import '../styles/Success.css';

const Success = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const { clearCart } = useCartContext();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(true);
    const hasProcessed = useRef(false);

    useEffect(() => {
        const finalizeOrder = async () => {
            const savedOrder = localStorage.getItem('pendingOrder');
            const pendingItems = savedOrder ? JSON.parse(savedOrder) : null;

            if (!sessionId) {
                navigate('/');
                return;
            }

            if (!pendingItems || pendingItems.length === 0 || hasProcessed.current) {
                setIsProcessing(false);
                return;
            }

            hasProcessed.current = true;

            try {
                await api.post('/api/orders/', {
                    items: pendingItems,
                    stripePaymentId: sessionId
                });

                clearCart();
                localStorage.removeItem('pendingOrder');
                setIsProcessing(false);

            } catch (error) {
                console.error("Failed to create order:", error);
                toast.error("Payment received, but order creation failed.");
                setIsProcessing(false);
            }
        };

        finalizeOrder();
    }, [sessionId, navigate, clearCart]);

    return (
        <div className="success-page">
            {isProcessing ? (
                <h2>Processing your order... Please do not close this page.</h2>
            ) : (
                <>
                    <h1 className="success-title">Success!</h1>
                    <h2>Thank you for your purchase!</h2>

                    <p className="success-subtext">
                        Your payment was successful and your order is now processing.
                    </p>
                    <p className="success-ref">
                        Order Reference: {sessionId}
                    </p>

                    <div className="success-actions">
                        <Link to="/orders" className="btn-primary">
                            View My Orders
                        </Link>
                        <Link to="/" className="btn-outline">
                            Continue Shopping
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}

export default Success;