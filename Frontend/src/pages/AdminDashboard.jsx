import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import '../styles/AdminDashboard.css'; 
import { useState, useEffect } from 'react';
import api from "../utils/api";
import { toast } from 'react-toastify';

const AdminDashboard = () => {
    const { user } = useAuthContext();
    const [booksCount, setBooksCount] = useState(0);
    const [ProcessingOrdersCount, setProcessingOrdersCount] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get("/api/orders/stats");
                setBooksCount(res.data.booksCount);
                setProcessingOrdersCount(res.data.ordersCount);
                setTotalRevenue(res.data.totalRevenue.toFixed(2)); 
            } catch (error) {
                toast.error(error.response?.data?.error || "Failed to load dashboard stats");
            }
        };

        if (user) {
            fetchStats();
        }
    }, [user]);

    return (
        <div className="admin-dashboard">
            <aside className="admin-sidebar">
                <h2>Admin Panel</h2>
                <p className="admin-email">{user?.email}</p>
                <nav className="admin-nav">
                    <Link to="/admin/books" className="admin-link">Manage Books</Link>
                    <Link to="/admin/books/new" className="admin-link">Add New Book</Link>
                    <Link to="/admin/orders" className="admin-link">Manage Orders</Link>
                </nav>
            </aside>
            <main className="admin-content">
                <h1>Dashboard Overview</h1>
                <p>Select an option from the sidebar to manage your store.</p>
                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Total Revenue</h3>
                        <p className="stat-number">${totalRevenue}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Total Books</h3>
                        <p className="stat-number">{booksCount}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Pending Orders</h3>
                        <p className="stat-number">{ProcessingOrdersCount}</p>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default AdminDashboard;