import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import OrderList from "../components/OrderList";
import "../styles/ManageOrders.css";
import api from "../utils/api";
import { toast } from 'react-toastify';


const ManageOrders = () => {

    const { user } = useAuthContext();
    const [orders, setOrders] = useState(null);
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [page, setPage] = useState(1);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get(`/api/orders?page=${page}&search=${search}`);
                setOrders(res.data);
            } catch (error) {
                toast.error(error.response?.data?.error || "Failed to load orders");
            }
        };

        fetchOrders();
    }, [page, search]);

    const handleStatusChange = async (id, status) => {
        try {
            await api.put(`/api/orders/${id}`, { status });
            setOrders(orders.map((o) => {
                if (o._id === id) {
                    return { ...o, status: status };
                }
                return o;
            }));
            toast.success(`Order status updated to ${status}`);
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to update status");
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