const kafka = require('node-rdkafka');
const config = require('./config');
const Message = require('./db');
// const elasticsearch = require('elasticsearch');
const { Client } = require('@elastic/elasticsearch');

const client = new Client({
  cloud :{
      id: config.elasticsearch.cloud_id
  },
  headers: {
    'Content-Type': 'application/vnd.elasticsearch+json; compatible-with=8'
  },
auth: {
  username: config.elasticsearch.username,
  password: config.elasticsearch.password
}
});


const consumer = new kafka.KafkaConsumer(config.kafka, {"auto.offset.reset": "earliest"});

consumer.connect();

consumer.on('ready', () => {
  console.log('Consumer is ready');

  consumer.subscribe(['success','failed']);

  consumer.consume();
});


// Set up success/failed topic consumer
consumer.on('data', async (data) => {
  const message = {
    topic: data.topic,
    value: data.value.toString()
  };

  if (message.topic === 'failed') {

    // Store data in MySQL    
    console.log(`Failed topic data: ${message.value}`);
    try {
      await Message.create(message);
    } catch (error) {
      console.error(`Failed to store message in database: ${error}`);
    }

  } else if (message.topic === 'success') {

    // Store data in ElasticSearch    
    const indexName = 'test3';
      const esMessage = {
      index: indexName,
      body: message
    };
    
    try {
      let res = {};
      res = await client.index(esMessage);
      
      console.log("Success Message stored in ElasticSearch for Success topic:", res);
    } catch (error) {
      console.error(`Error : success to store message in ElasticSearch: ${error}`);
    }
  }
});

module.exports = consumer;
