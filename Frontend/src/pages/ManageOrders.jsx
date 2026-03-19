import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import OrderList from "../components/OrderList";
import "../styles/ManageOrders.css";


const ManageOrders = () =>{

    const {user} = useAuthContext();
    const [orders, setOrders] = useState(null);

    useEffect(() => {
            const fetchOrders = async () => {
                const res = await fetch("/api/orders/", {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
    
                const json = await res.json();
    
                if (res.ok) {
                    setOrders(json);
                }else{
                    alert(json.error);
                }
            };
    
            fetchOrders()
        }, [user]);

    const handleStatusChange = async (id, status) =>{
        const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ status }) 
    });

        const json = await res.json();

        if(res.ok){
            setOrders(orders.map((o)=>{
                if(o._id === id){
                    return {...o, status: status};
                }else{
                    return o;
                }
            }))
        }else{
            alert(json.error);
        }
    }

    return (
        <div className="manage-orders-container">
            <h2>Manage Customers Orders</h2>
            <div className="orders-list">
                {orders && orders.length === 0 && <p className="no-orders-msg">No orders have been placed yet.</p>}
                {orders && orders.map((order, index) => (
                    <OrderList 
                        key={order._id} 
                        order={order}
                        orderNum={orders.length - index}
                        isAdmin={true}
                        onStatusChange={handleStatusChange} 
                    />
                ))}
            </div>
        </div>
    );
}

export default ManageOrders;