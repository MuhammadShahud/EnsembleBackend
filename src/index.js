const app = require('./app');
const mongoose = require('mongoose');
const config = require('./config/config');
const logger = require('./config/logger');
const {env} = require('./config/config');

let server;
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  if (config.env === 'development') {
    logger.info('Connected to Development MongoDB');
  } else {
    logger.warn('Connected to Production MongoDB');
  }
  server = app.listen(config.port, () => {
    logger.info(`Listening on port ${config.port}`);
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};
