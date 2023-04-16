const kafka = require('node-rdkafka');
const config = require('./config');
const Message = require('./db');
// const elasticsearch = require('elasticsearch');
const { Client } = require('@elastic/elasticsearch');

// const client = new elasticsearch.Client({
//   host: '',
//   auth: {
//     username: '',
//     password: ''
//   },
//   log: 'error'
// });

const client = new Client({
  node: config.elasticsearch.node,
  auth: {
    username: config.elasticsearch.username,
    password: config.elasticsearch.password
  },
  headers: {
    'Content-Type': 'application/json'
  },
  ssl: {
    rejectUnauthorized: false
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
    const indexName = 'myindex';

    // const esMessage = {
    //   index: indexName,
    //   body: message
    // };

    const data = {
      name: 'John Doe',
      email: 'john.doe@example.com'
    };
    

    const esMessage = {
      index: 'myindex',
      body: data
    };
    

    try {
      await client.index(esMessage, (err, res, status) => {
        if (err) {
          console.error(err);
        } else {
          console.log(res);
        }
      });
      console.log(`Message stored in ElasticSearch for Success topic: ${JSON.stringify(esMessage)}`);

    } catch (error) {
      console.error(`Failed to store message in ElasticSearch: ${error}`);
    }


  }
});


module.exports = consumer;
