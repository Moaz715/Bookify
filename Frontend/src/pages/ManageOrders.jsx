import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import OrderList from "../components/OrderList";
import "../styles/ManageOrders.css";


const ManageOrders = () => {

    const { user } = useAuthContext();
    const [orders, setOrders] = useState(null);
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [page, setPage] = useState(1);

    useEffect(() => {
        const fetchOrders = async () => {
            const res = await fetch(`/api/orders?page=${page}&search=${search}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            const json = await res.json();

            if (res.ok) {
                setOrders(json);
            } else {
                console.log(json.error);
            }
        };

        fetchOrders()
    }, [user, page, search]);

    const handleStatusChange = async (id, status) => {
        const res = await fetch(`/api/orders/${id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({ status })
        });

        const json = await res.json();

        if (res.ok) {
            setOrders(orders.map((o) => {
                if (o._id === id) {
                    return { ...o, status: status };
                } else {
                    return o;
                }
            }))
        } else {
            alert(json.error);
        }
    }

    return (
        <div className="manage-orders-container">
            <h2>Manage Customers Orders</h2>
            <div style={{ display: 'flex', flex: 1, gap: '10px' }}>
                <input
                    type="text"
                    placeholder="Search orders by email..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            setSearch(searchInput);
                            setPage(1);
                        }
                    }}
                />
                <button
                    className="search-btn"
                    onClick={() => {
                        setSearch(searchInput);
                        setPage(1);
                    }}
                >
                    Search
                </button>
            </div>
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
                {orders && <div className="pagination-controls">
                    <button
                        className="page-btn"
                        onClick={() => setPage(prev => prev - 1)}
                        disabled={page === 1}
                    >
                        Previous
                    </button>

                    <span className="page-indicator">
                        Page {page}
                    </span>

                    <button
                        className="page-btn"
                        onClick={() => setPage(prev => prev + 1)}
                        disabled={orders.length < 10}
                    >
                        Next
                    </button>
                </div>}
            </div>
        </div>
    );
}

export default ManageOrders;