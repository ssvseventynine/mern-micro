const express = require('express');
const mongoose = require('mongoose');
const Consul = require('consul');

const app = express();
app.use(express.json());

const PORT = 5003;
const SERVICE_ID = `notification-service-${PORT}`;
const consul = new Consul({ host: '127.0.0.1', port: 8500 });

mongoose.connect('mongodb://localhost:27017/MERN_MICRO_NOTIFICATIONS')
  .then(() => console.log('Notification DB Connected Successfully'))
  .catch(err => console.error(err));

const notificationSchema = new mongoose.Schema({
  message: String,
  type: String,
  createdAt: { type: Date, default: Date.now }
});
const Notification = mongoose.model('Notification', notificationSchema);

app.get('/notifications', async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

app.get('/health', (req, res) => res.status(200).send('Notification Service is Healthy'));

app.listen(PORT, () => {
  console.log(`Notification Service running on port ${PORT}`);
  consul.agent.service.register({
    id: SERVICE_ID,
    name: 'notification-service',
    address: '127.0.0.1',
    port: PORT,
    check: { http: `http://127.0.0.1:${PORT}/health`, interval: '10s' }
  }, (err) => {
    if (!err) console.log('Registered notification-service with Consul.');
  });
});