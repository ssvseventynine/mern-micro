const express = require('express');
const mongoose = require('mongoose');
const Consul = require('consul');

const app = express();
app.use(express.json());

const PORT = 5000;
const SERVICE_ID = `user-service-${PORT}`;

// Initialize HashiCorp Consul Agent Client Connection
const consul = new Consul({ host: '127.0.0.1', port: 8500 });

const MONGO_URI = 'mongodb://localhost:27017/MERN_MICRO_USERS';
mongoose.connect(MONGO_URI)
  .then(() => console.log('User Microservice connected to MongoDB successfully!'))
  .catch(err => console.error('User DB connection error:', err));

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  role: { type: String, default: 'Customer' }
 });
const User = mongoose.model('User', userSchema);

app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Health check endpoint for Consul monitoring updates
app.get('/health', (req, res) => res.status(200).send('User Service is Healthy'));

app.listen(PORT, () => {
  console.log(`User Microservice is running on port ${PORT}`);

  // Dynamic Consul Registration Protocol Lifecycle Block
  consul.agent.service.register({
    id: SERVICE_ID,
    name: 'user-service',
    address: '127.0.0.1',
    port: PORT,
    check: {
      http: `http://127.0.0.1:${PORT}/health`,
      interval: '10s'
    }
  }, (err) => {
    if (err) {
      console.error('Consul registration failed:', err);
    } else {
      console.log('Successfully registered with HashiCorp Consul Discovery Dashboard!');
    }
  });
});