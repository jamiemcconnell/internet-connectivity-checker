'use strict';

module.exports = {
  mongoEndpoint: (process.env.mongoEndpoint || 'mongodb' || '192.168.99.100'),
  
  checkEndpoints: ['http://www.google.com', 'http://www.cloudflare.com', 'http://www.apple.com', 'http://www.microsoft.com'],
  checkIntervalSeconds: 30,
  attemptConnectionTimeoutSeconds: 5,
  reAttemptIntervalSeconds: 5,
  maxAttempts: 8,
  confirmedDownCount: 4
  
};