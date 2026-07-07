const express = require('express');
const cors = require('cors'); // NEW
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 8080;

// Enable Global CORS permissions for our Frontend port
app.use(cors({ origin: 'http://localhost:3000' })); // NEW

app.use((req, res, next) => {
  console.log(`[Gateway Intercept]: ${req.method} ${req.url}`);
  next();
});

// 1. User Route
app.use(createProxyMiddleware({
  pathFilter: '/users',
  target: 'http://127.0.0.1:5000',
  changeOrigin: true
}));

// 2. Product Route
app.use(createProxyMiddleware({
  pathFilter: '/products',
  target: 'http://127.0.0.1:5001',
  changeOrigin: true
}));

// 3. Order Route
app.use(createProxyMiddleware({
  pathFilter: '/orders',
  target: 'http://127.0.0.1:5002',
  changeOrigin: true
}));

// 4. Notification Route
app.use(createProxyMiddleware({
  pathFilter: '/notifications',
  target: 'http://127.0.0.1:5003',
  changeOrigin: true
}));

app.get('/', (req, res) => {
  res.status(200).json({ status: "Gateway Core Online" });
});

app.listen(PORT, () => {
  console.log(`🚀 API Gateway running smoothly on http://localhost:${PORT}`);
});