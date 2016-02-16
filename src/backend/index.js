'use strict';

var db = require('./db.js');

db.mongoose.connection.on('connected', function() {
  console.log('Successfully connected to Mongo');
  require('./lib.js').start();
});
