import OrderList from "../components/OrderList";
import { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import '../styles/Orders.css';

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true); 
    const { user } = useAuthContext();

    useEffect(() => {
        const getUserOrders = async () => {

            const res = await fetch(`/api/orders/user?page=${page}`, {
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            });

            const json = await res.json();

            if (res.ok) {
                if(page === 1){
                    setOrders(json);
                }else{
                    setOrders(prevOrders => [...prevOrders, ...json])
                }
                if(json.length > 5){
                    setHasMore(true);
                }else{
                    setHasMore(false);
                }
            }
        }
        getUserOrders();
    }, [user]);

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
                        Load More Books
                    </button>
                </div>
            )}
        </div>
    );
}

export default UserOrders;