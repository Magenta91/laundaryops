import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || '';

function OrdersList({ token, setMessage }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ 
    status: '', 
    customer_name: '', 
    phone: '', 
    garment: '' 
  });

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const fetchOrders = async () => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/api/orders?${params}`, { headers });
      const data = await res.json();
      setOrders(data.orders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Status updated successfully' });
        fetchOrders();
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update status' });
    }
  };

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <div className="card">
      <h2>Orders ({orders.length})</h2>

      <div className="filters">
        <div className="form-group">
          <label>Status</label>
          <select 
            value={filters.status} 
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option value="">All</option>
            <option value="RECEIVED">Received</option>
            <option value="PROCESSING">Processing</option>
            <option value="READY">Ready</option>
            <option value="DELIVERED">Delivered</option>
          </select>
        </div>
        <div className="form-group">
          <label>Customer Name</label>
          <input 
            type="text" 
            value={filters.customer_name}
            onChange={(e) => setFilters({...filters, customer_name: e.target.value})}
            placeholder="Search by name"
          />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input 
            type="text" 
            value={filters.phone}
            onChange={(e) => setFilters({...filters, phone: e.target.value})}
            placeholder="Search by phone"
          />
        </div>
        <div className="form-group">
          <label>Garment Type</label>
          <input 
            type="text" 
            value={filters.garment}
            onChange={(e) => setFilters({...filters, garment: e.target.value})}
            placeholder="Search by garment"
          />
        </div>
      </div>

      <div className="orders-grid">
        {orders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <span className="order-id">{order.id}</span>
              <span className={`status-badge status-${order.status}`}>
                {order.status}
              </span>
            </div>

            <div className="order-details">
              <div className="detail-item">
                <div className="detail-label">Customer</div>
                <div className="detail-value">{order.customer_name}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Phone</div>
                <div className="detail-value">{order.phone}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Total Bill</div>
                <div className="detail-value">₹{order.total_bill}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Created</div>
                <div className="detail-value">
                  {new Date(order.created_at).toLocaleDateString()}
                </div>
              </div>
              {order.estimated_delivery && (
                <div className="detail-item">
                  <div className="detail-label">Est. Delivery</div>
                  <div className="detail-value">
                    {new Date(order.estimated_delivery).toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>

            <div className="status-update">
              <label>Update Status:</label>
              <select 
                value={order.status}
                onChange={(e) => updateStatus(order.id, e.target.value)}
              >
                <option value="RECEIVED">Received</option>
                <option value="PROCESSING">Processing</option>
                <option value="READY">Ready</option>
                <option value="DELIVERED">Delivered</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {orders.length === 0 && (
        <div className="empty-state">
          No orders found
        </div>
      )}
    </div>
  );
}

export default OrdersList;
