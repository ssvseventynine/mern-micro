const express = require('express');
const mongoose = require('mongoose');
const Consul = require('consul');

const app = express();
app.use(express.json());

const PORT = 5001;
const SERVICE_ID = `product-service-${PORT}`;

// Initialize Consul Client
const consul = new Consul({ host: '127.0.0.1', port: 8500 });

// MongoDB Connection
const MONGO_URI = 'mongodb://localhost:27017/MERN_MICRO_PRODUCTS';
mongoose.connect(MONGO_URI)
  .then(() => console.log('Product DB Connected Successfully'))
  .catch(err => console.error(err));

// FIXED CASING HERE:
const productSchema = new mongoose.Schema({ name: String, price: Number, stock: Number });
const Product = mongoose.model('Product', productSchema);

app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Required: Health check endpoint for Consul to verify the service is alive
app.get('/health', (req, res) => res.status(200).send('Product Service is Healthy'));

app.listen(PORT, () => {
  console.log(`Product Service running on port ${PORT}`);
  
  // Register with Consul
  consul.agent.service.register({
    id: SERVICE_ID,
    name: 'product-service',
    address: '127.0.0.1',
    port: PORT,
    check: {
      http: `http://127.0.0.1:${PORT}/health`,
      interval: '10s'
    }
  }, (err) => {
    if (err) console.error('Consul registration failed:', err);
    else console.log('Successfully registered product-service with Consul.');
  });
});