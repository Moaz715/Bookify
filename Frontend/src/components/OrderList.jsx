const OrderList = ({ order, orderNum}) => {

    return (
        <div className="order-card" style={{ border: '1px solid #ccc', margin: '20px 0', padding: '15px' }}>
            <h3>Order #{orderNum}</h3>
            <p>Status: <strong>{order.status}</strong></p>
            <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            <ul>
                {order.items.map((item) => (
                    <li key={item._id}>
                        <strong>{item.bookId.title}</strong> (Qty: {item.quantity}) - Price Of One: ${item.priceAtPurchase.toFixed(2)} - Total: {(item.quantity*item.priceAtPurchase).toFixed(2)}
                    </li>
                ))}
            </ul>
            <h4>Order Total: ${order.totalAmount.toFixed(2)}</h4>
        </div>
    );
}

export default OrderList;