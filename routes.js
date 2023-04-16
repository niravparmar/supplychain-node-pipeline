const express = require('express');
const router = express.Router();
const producer = require('./producer');

// Success endpoint
router.post('/success', (req, res) => {
  const message = req.body.message;

  producer.produce('success', null, Buffer.from(message));

  res.send(`Produced message to success topic: ${message}`);
});

// Failed endpoint
router.post('/failed', (req, res) => {
  const message = req.body.message;

  producer.produce('failed', null, Buffer.from(message));

  res.send(`Produced message to failed topic: ${message}`);
});

// Home page
router.get('/', (req, res) => {
  res.send('Welcome to the Supplychain Kafka demo app!');
});

module.exports = router;
