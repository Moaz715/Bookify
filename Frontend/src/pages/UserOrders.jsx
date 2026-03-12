import OrderList from "../components/OrderList";
import {useState, useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from "../hooks/useAuthContext";

const UserOrders = () => {
    const [orders, setOrders] = useState(null);
    const {user} = useAuthContext();

    useEffect(() => {
        const getUserOrders = async () => {
            const res = await fetch('/api/orders/user', {
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}` 
                }
            });

            const json = await res.json();

            if (res.ok) {
                setOrders(json);
            }
        }
        getUserOrders();
    }, [user]);


    return (
        <div className="orders-page" style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
            <h2 style={{ marginBottom: '20px' }}>Your Orders</h2>
            {orders && orders.length === 0 && (
                <p>You haven't placed any orders yet.</p>
            )}
            <div>
                {orders && orders.map((order, i) => (
                    <OrderList key={order._id} order={order} orderNum={orders.length-i}/>
                ))}
            </div>
        </div>
    );
}

export default UserOrders;