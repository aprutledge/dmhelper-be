'use strict';

require('dotenv').config();
const http = require('http');
const app = require('./app');
const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || 'Development';
const APP_NAME = process.env.APP_NAME || 'dmhelper server';
const server = http.createServer(app);

server.listen(PORT, () => {
  const date = new Date();
  console.log('|--------------------------------------------|');
  console.log(`| Server      : ${APP_NAME}`);
  console.log(`| Environment : ${ENV}`);
  console.log(`| Port        : ${PORT}`);
  console.log(`| Date        : ${date.toJSON().split('T').join(' ')}`);
});

process.on('SIGTERM', () => {
  server.close(() => {
    process.exit(0);
  });
});

module.exports = server;
