import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || '';

function Auth({ onLogin, setMessage }) {
  const [authMode, setAuthMode] = useState('login');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      const res = await fetch(`${API_URL}/api/auth/${authMode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (res.ok) {
        onLogin(result.token, result.user);
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-section">
      <div className="tabs">
        <button 
          className={`tab ${authMode === 'login' ? 'active' : ''}`}
          onClick={() => setAuthMode('login')}
        >
          Login
        </button>
        <button 
          className={`tab ${authMode === 'register' ? 'active' : ''}`}
          onClick={() => setAuthMode('register')}
        >
          Register
        </button>
      </div>

      {authMode === 'login' ? (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input type="text" name="username" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" required />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" name="name" required />
          </div>
          <div className="form-group">
            <label>Username</label>
            <input type="text" name="username" required />
          </div>
          <div className="form-group">
            <label>Password (min 6 characters)</label>
            <input type="password" name="password" required minLength="6" />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      )}
    </div>
  );
}

export default Auth;
