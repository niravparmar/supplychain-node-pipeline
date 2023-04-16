const kafka = require('node-rdkafka');
const config = require('./config');

const producer = new kafka.Producer(config.kafka);

producer.connect();

module.exports = producer;
