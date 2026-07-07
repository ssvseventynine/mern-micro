const express = require('express');
const mongoose = require('mongoose');
const Consul = require('consul');

const app = express();
app.use(express.json());

const PORT = 5002;
const SERVICE_ID = `order-service-${PORT}`;
const consul = new Consul({ host: '127.0.0.1', port: 8500 });

mongoose.connect('mongodb://localhost:27017/MERN_MICRO_ORDERS')
  .then(() => console.log('Order DB Connected Successfully'))
  .catch(err => console.error(err));

const orderSchema = new mongoose.Schema({
  productName: String,
  quantity: Number,
  status: { type: String, default: 'Pending' }
});
const Order = mongoose.model('Order', orderSchema);

app.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Add this route to handle incoming orders from the UI
app.post('/orders', async (req, res) => {
  try {
    const newOrder = new Order({
      productName: req.body.productName,
      quantity: req.body.quantity,
      status: 'Pending' // Default status for new orders
    });
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder); // Return the newly created order back to the UI
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

app.get('/health', (req, res) => res.status(200).send('Order Service is Healthy'));

app.listen(PORT, () => {
  console.log(`Order Service running on port ${PORT}`);
  consul.agent.service.register({
    id: SERVICE_ID,
    name: 'order-service',
    address: '127.0.0.1',
    port: PORT,
    check: { http: `http://127.0.0.1:${PORT}/health`, interval: '10s' }
  }, (err) => {
    if (!err) console.log('Registered order-service with Consul.');
  });
});