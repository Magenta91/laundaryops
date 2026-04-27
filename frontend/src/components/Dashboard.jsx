import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || '';

function Dashboard({ token }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await fetch(`${API_URL}/api/dashboard`);
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div>
      <div className="stats">
        <div className="stat-card">
          <h3>{stats.total_orders}</h3>
          <p>Total Orders</p>
        </div>
        <div className="stat-card">
          <h3>₹{stats.total_revenue}</h3>
          <p>Total Revenue</p>
        </div>
        <div className="stat-card">
          <h3>{stats.orders_by_status.RECEIVED}</h3>
          <p>Received</p>
        </div>
        <div className="stat-card">
          <h3>{stats.orders_by_status.PROCESSING}</h3>
          <p>Processing</p>
        </div>
        <div className="stat-card">
          <h3>{stats.orders_by_status.READY}</h3>
          <p>Ready</p>
        </div>
        <div className="stat-card">
          <h3>{stats.orders_by_status.DELIVERED}</h3>
          <p>Delivered</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
