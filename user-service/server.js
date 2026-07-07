const express = require('express');
const mongoose = require('mongoose');
const Consul = require('consul');

const app = express();
app.use(express.json());

const PORT = 5000;
const SERVICE_ID = `user-service-${PORT}`;

// 1. PLACEHOLDER ARRANGEMENT FOR CONSUL
// Uses the Docker/Cloud network alias 'consul' if present, otherwise defaults to localhost '127.0.0.1'
const CONSUL_HOST = process.env.CONSUL_HOST || '127.0.0.1';
const consul = new Consul({ host: CONSUL_HOST, port: 8500 });

// 2. PLACEHOLDER ARRANGEMENT FOR MONGO DB
// Uses the Cloud network URI if present, otherwise defaults to your local database connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/MERN_MICRO_USERS';
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
    // Uses the service name as the network domain inside Docker, otherwise falls back to local IP
    address: process.env.SERVICE_ADDRESS || '127.0.0.1',
    port: PORT,
    check: {
      // Directs Consul to the container address inside Docker, or local machine if running locally
      http: `http://${process.env.SERVICE_ADDRESS || '127.0.0.1'}:${PORT}/health`,
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