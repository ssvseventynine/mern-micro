const express = require('express');
const cors = require('cors'); 
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 8080;

// Enable Global CORS permissions for our Frontend port
app.use(cors({ origin: 'http://localhost:3000' })); 

app.use((req, res, next) => {
  console.log(`[Gateway Intercept]: ${req.method} ${req.url}`);
  next();
});

// 1. User Route (Uses container alias domain if present, falls back to local machine loopback)
app.use(createProxyMiddleware({
  pathFilter: '/users',
  target: process.env.USER_SERVICE_URL || 'http://127.0.0.1:5000',
  changeOrigin: true
}));

// 2. Product Route (Uses container alias domain if present, falls back to local machine loopback)
app.use(createProxyMiddleware({
  pathFilter: '/products',
  target: process.env.PRODUCT_SERVICE_URL || 'http://127.0.0.1:5001',
  changeOrigin: true
}));

// 3. Order Route (Uses container alias domain if present, falls back to local machine loopback)
app.use(createProxyMiddleware({
  pathFilter: '/orders',
  target: process.env.ORDER_SERVICE_URL || 'http://127.0.0.1:5002',
  changeOrigin: true
}));

// 4. Notification Route (Uses container alias domain if present, falls back to local machine loopback)
app.use(createProxyMiddleware({
  pathFilter: '/notifications',
  target: process.env.NOTIFICATION_SERVICE_URL || 'http://127.0.0.1:5003',
  changeOrigin: true
}));

app.get('/', (req, res) => {
  res.status(200).json({ status: "Gateway Core Online" });
});

app.listen(PORT, () => {
  console.log(`🚀 API Gateway running smoothly on http://localhost:${PORT}`);
});