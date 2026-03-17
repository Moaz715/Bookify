const OrderList = ({ order, orderNum }) => {
    return (
        <div className="order-card">
            <div className="order-header">
                <h3>Order #{orderNum}</h3>
                <span className="status-badge">{order.status}</span>
            </div>
            
            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '15px' }}>
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