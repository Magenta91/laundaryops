import { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard'
import CreateOrder from './components/CreateOrder'
import OrdersList from './components/OrdersList'
import Auth from './components/Auth'

const API_URL = import.meta.env.VITE_API_URL || '';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [activeTab, setActiveTab] = useState('dashboard');
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        localStorage.removeItem('token');
        setToken(null);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };

  const handleLogin = (token, user) => {
    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
    setMessage({ type: 'success', text: 'Login successful!' });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setMessage({ type: 'success', text: 'Logged out successfully' });
  };

  return (
    <div className="container">
      <div className="header">
        <h1>🧺 LaundryOps</h1>
        <p>Professional Laundry Order Management System</p>
      </div>

      {message && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      {!user ? (
        <>
          <Auth onLogin={handleLogin} setMessage={setMessage} />
          <div className="demo-info">
            <p><strong>Demo Mode:</strong> You can also use the system without authentication</p>
            <button className="btn btn-secondary" onClick={() => setActiveTab('dashboard')} style={{marginTop: '10px'}}>
              Continue as Guest
            </button>
          </div>
          {activeTab === 'dashboard' && <Dashboard token={null} />}
        </>
      ) : (
        <>
          <div className="user-info">
            <div>
              <strong>Welcome, {user.name}!</strong>
              <span style={{marginLeft: '10px', color: '#666'}}>@{user.username}</span>
            </div>
            <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
          </div>

          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </button>
            <button 
              className={`tab ${activeTab === 'create' ? 'active' : ''}`}
              onClick={() => setActiveTab('create')}
            >
              Create Order
            </button>
            <button 
              className={`tab ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              View Orders
            </button>
          </div>

          {activeTab === 'dashboard' && <Dashboard token={token} />}
          {activeTab === 'create' && <CreateOrder token={token} setMessage={setMessage} />}
          {activeTab === 'orders' && <OrdersList token={token} setMessage={setMessage} />}
        </>
      )}
    </div>
  );
}

export default App;
