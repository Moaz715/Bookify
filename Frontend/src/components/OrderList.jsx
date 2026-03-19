const OrderList = ({ order, orderNum, isAdmin = false, onStatusChange }) => {
    return (
        <div className="order-card">
            <div className="order-header">
                <div>
                    <h3>Order #{orderNum}</h3>
                    {isAdmin && <p className="customer-email">Customer: {order.userId?.email || "Unknown User"}</p>}
                </div>
                
                {isAdmin ? (
                    <select 
                        className="admin-status-select"
                        value={order.status}
                        onChange={(e) => onStatusChange(order._id, e.target.value)}
                    >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                ) : (
                    <span className="status-badge">{order.status}</span>
                )}
            </div>
            
            <p className="order-date">
                Placed on: {new Date(order.createdAt).toLocaleDateString()}
            </p>
            
            <ul className="order-items">
                {order.items.map((item) => (
                    <li key={item._id}>
                        <div className="item-details">
                            <strong>{item.bookId?.title || "Deleted Book"}</strong>
                            <span>Qty: {item.quantity} × ${item.priceAtPurchase.toFixed(2)}</span>
                        </div>
                        <div className="item-price">
                            ${(item.quantity * item.priceAtPurchase).toFixed(2)}
                        </div>
                    </li>
                ))}
            </ul>
            
            <h4 className="order-total">Total: ${order.totalAmount.toFixed(2)}</h4>
        </div>
    );
}

export default OrderList;