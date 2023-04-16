const Sequelize = require('sequelize');
const config = require('./config');

const sequelize = new Sequelize(
  config.db.database,
  config.db.username,
  config.db.password,
  {
    dialect: config.db.dialect,
    host: config.db.host,
    logging: false
  }
);

const Message = sequelize.define('message', {
  topic: Sequelize.STRING,
  value: Sequelize.STRING
});

sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
    // Add a message to the database
    // return Message.create({ topic: 'database', value: 'Database connection has been established successfully.' });
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

sequelize.sync();

module.exports = Message;
