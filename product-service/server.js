const express = require('express');
const mongoose = require('mongoose');
const Consul = require('consul');

const app = express();
app.use(express.json());

const PORT = 5001;
const SERVICE_ID = `product-service-${PORT}`;

// Placeholder arrangement for Consul Host
const CONSUL_HOST = process.env.CONSUL_HOST || '127.0.0.1';
const consul = new Consul({ host: CONSUL_HOST, port: 8500 });

// Placeholder arrangement for MongoDB connection URI
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/MERN_MICRO_PRODUCTS';
mongoose.connect(MONGO_URI)
  .then(() => console.log('Product DB Connected Successfully'))
  .catch(err => console.error(err));

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

app.get('/health', (req, res) => res.status(200).send('Product Service is Healthy'));

app.listen(PORT, () => {
  console.log(`Product Service running on port ${PORT}`);
  
  consul.agent.service.register({
    id: SERVICE_ID,
    name: 'product-service',
    address: process.env.SERVICE_ADDRESS || '127.0.0.1',
    port: PORT,
    check: {
      http: `http://${process.env.SERVICE_ADDRESS || '127.0.0.1'}:${PORT}/health`,
      interval: '10s'
    }
  }, (err) => {
    if (err) console.error('Consul registration failed:', err);
    else console.log('Successfully registered product-service with Consul.');
  });
});