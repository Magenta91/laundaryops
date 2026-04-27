import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || '';

const PRICES = {
  Shirt: 50,
  Pants: 60,
  Saree: 120,
  Jacket: 150,
  Kurta: 80,
  Bedsheet: 100,
  Towel: 30
};

function CreateOrder({ token, setMessage }) {
  const [garments, setGarments] = useState({
    Shirt: 0, Pants: 0, Saree: 0, Jacket: 0, Kurta: 0, Bedsheet: 0, Towel: 0
  });
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const selectedGarments = Object.entries(garments)
      .filter(([_, qty]) => qty > 0)
      .map(([garment, quantity]) => ({ garment, quantity }));

    if (selectedGarments.length === 0) {
      setMessage({ type: 'error', text: 'Please select at least one garment' });
      setLoading(false);
      return;
    }

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          customer_name: customerName,
          phone,
          garments: selectedGarments
        })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: `Order created successfully! Order ID: ${data.id}` });
        setGarments({ Shirt: 0, Pants: 0, Saree: 0, Jacket: 0, Kurta: 0, Bedsheet: 0, Towel: 0 });
        setCustomerName('');
        setPhone('');
      } else {
        setMessage({ type: 'error', text: data.error });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to create order' });
    } finally {
      setLoading(false);
    }
  };

  const total = Object.entries(garments).reduce(
    (sum, [garment, qty]) => sum + (PRICES[garment] * qty), 
    0
  );

  return (
    <div className="card">
      <h2>Create New Order</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Customer Name</label>
          <input 
            type="text" 
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required 
          />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input 
            type="tel" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required 
          />
        </div>

        <div className="form-group">
          <label>Select Garments</label>
          <div className="garment-selector">
            {Object.keys(garments).map(garment => (
              <div key={garment} className="garment-item">
                <strong>{garment}</strong>
                <div style={{color: '#667eea', fontSize: '14px', margin: '5px 0'}}>
                  ₹{PRICES[garment]}
                </div>
                <input 
                  type="number" 
                  min="0"
                  value={garments[garment]}
                  onChange={(e) => setGarments({
                    ...garments, 
                    [garment]: parseInt(e.target.value) || 0
                  })}
                  placeholder="Qty"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="total-bill">
          <strong style={{fontSize: '1.2em'}}>Total Bill: ₹{total}</strong>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Creating Order...' : 'Create Order'}
        </button>
      </form>
    </div>
  );
}

export default CreateOrder;
