// frontend/src/App.js
import React, { useState, useEffect } from 'react';

// Single address pointing strictly to our Express Gateway tier
const GATEWAY_URL = 'http://localhost:8080';

export default function App() {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>MERN Enterprise Microservices Control Center Matrix</h1>
        <p>Real-time data synchronization through centralized Express Gateway proxy mapping</p>
      </header>
      
      <div style={styles.grid}>
        <UserManagementModule />
        <InventoryTrackerModule />
        <OrderProcessorModule />
        <NotificationCenterModule />
      </div>
    </div>
  );
}

// 1. User Component
function UserManagementModule() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetch(`${GATEWAY_URL}/users`)
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error("User fetch error:", err));
  }, []);

  return (
    <div style={styles.card}>
      <h3 style={{color: '#0070f3'}}>👤 User Management Service</h3>
      <hr />
      {users.length === 0 ? <p>Loading system accounts...</p> : (
        <ul>
          {users.map(u => <li key={u._id}><strong>{u.username}</strong> ({u.email}) - <em>{u.role}</em></li>)}
        </ul>
      )}
    </div>
  );
}

// 2. Product Component
function InventoryTrackerModule() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    fetch(`${GATEWAY_URL}/products`)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Product fetch error:", err));
  }, []);

  return (
    <div style={styles.card}>
      <h3 style={{color: '#10b981'}}>📦 Real-Time Product Inventory</h3>
      <hr />
      {products.length === 0 ? <p>Loading database inventory...</p> : (
        <ul>
          {products.map(p => <li key={p._id}><strong>{p.name}</strong>: ${p.price} | Stock: {p.stock} units</li>)}
        </ul>
      )}
    </div>
  );
}

// 3. Updated Order Component with Read-Write capabilities
function OrderProcessorModule() {
  const [orders, setOrders] = useState([]);
  const [newProduct, setNewProduct] = useState('');

  // Fetch orders (Read)
  const fetchOrders = () => {
    fetch(`${GATEWAY_URL}/orders`)
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error("Order fetch error:", err));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Submit a new order (Write)
  const handleCreateOrder = (e) => {
    e.preventDefault();
    if (!newProduct.trim()) return;

    fetch(`${GATEWAY_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productName: newProduct, quantity: 1 })
    })
      .then(res => res.json())
      .then(returnedData => {
        console.log("Success! Returned from DB:", returnedData);
        setNewProduct(''); // Clear input
        fetchOrders(); // Refresh list automatically
      })
      .catch(err => console.error("Error creating order:", err));
  };

  return (
    <div style={styles.card}>
      <h3 style={{color: '#f59e0b'}}>🛒 Processing Orders Queue</h3>
      <hr />
      
      {/* Dynamic Input Form */}
      <form onSubmit={handleCreateOrder} style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="Enter item name..." 
          value={newProduct}
          onChange={(e) => setNewProduct(e.target.value)}
          style={{ flex: 1, padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '6px 12px', backgroundColor: '#f59e0b', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Place Order
        </button>
      </form>

      {orders.length === 0 ? <p>Loading active purchases...</p> : (
        <ul>
          {orders.map(o => <li key={o._id} style={{ marginBottom: '8px' }}>Item: {o.productName} | Qty: {o.quantity} -> <span style={styles.badge}>{o.status}</span></li>)}
        </ul>
      )}
    </div>
  );
}

// 4. Notification Component
function NotificationCenterModule() {
  const [logs, setLogs] = useState([]);
  useEffect(() => {
    fetch(`${GATEWAY_URL}/notifications`)
      .then(res => res.json())
      .then(data => setLogs(data))
      .catch(err => console.error("Notification fetch error:", err));
  }, []);

  return (
    <div style={styles.card}>
      <h3 style={{color: '#ef4444'}}>🔔 System Notification Logs</h3>
      <hr />
      {logs.length === 0 ? <p>Loading dispatch network logs...</p> : (
        <ul>
          {logs.map(l => <li key={l._id}>[{l.type}] {l.message}</li>)}
        </ul>
      )}
    </div>
  );
}

// CSS-in-JS layout objects for rapid styling preview
const styles = {
  container: { padding: '30px', backgroundColor: '#f9fafb', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' },
  header: { textAlign: 'center', marginBottom: '40px', borderBottom: '2px solid #e5e7eb', paddingBottom: '20px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' },
  card: { backgroundColor: '#ffffff', borderRadius: '8px', padding: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' },
  badge: { backgroundColor: '#d1fae5', color: '#065f46', padding: '3px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }
};