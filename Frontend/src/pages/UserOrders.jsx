import OrderList from "../components/OrderList";
import { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import '../styles/Orders.css';
import api from "../utils/api";
import { toast } from 'react-toastify';

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const { user } = useAuthContext();

    useEffect(() => {
        const getUserOrders = async () => {
            try {
                const res = await api.get(`/api/orders/user?page=${page}`);

                if (page === 1) {
                    setOrders(res.data);
                } else {
                    setOrders(prevOrders => [...prevOrders, ...res.data]);
                }

                if (res.data.length < 10) {
                    setHasMore(false);
                }
            } catch (error) {
                toast.error(error.response?.data?.error || "Failed to fetch orders");
            }
        }
        if (user) {
            getUserOrders();
        }
    }, [user, page]);

    return (
        <div className="orders-page">
            <h2>Your Orders</h2>

            {orders && orders.length === 0 && (
                <p style={{ color: 'var(--text-light)' }}>You haven't placed any orders yet.</p>
            )}

            <div>
                {orders && orders.map((order, i) => (
                    <OrderList key={order._id} order={order} orderNum={orders.length - i} />
                ))}
            </div>

            {orders.length > 0 && hasMore && (
                <div className="load-more-wrapper">
                    <button
                        className="load-more-btn"
                        onClick={() => setPage(prev => prev + 1)}
                    >
                        Load More Orders
                    </button>
                </div>
            )}
        </div>
    );
}

export default UserOrders;