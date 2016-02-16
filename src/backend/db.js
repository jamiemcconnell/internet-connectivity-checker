'use strict';

var constants = require('../../constants.js');
var mongoose = require('mongoose');
var uuid = require('uuid');

mongoose.connect('mongodb://'+ (process.env.MONGO_ENDPOINT || constants.mongoEndpoint || 'mongodb') + ':27017/events');


var PingEvent = mongoose.model('PingEvent', {
  _id: { type: 'String', default: function() { return uuid.v4(); }},
  endpoint: { type: 'String' },
  duration: { type: 'Number' },
  success: { type: 'Boolean' },
  error: { type: 'Mixed', default: '' },
  timestamp: { type: 'Date' },
});

module.exports = {
  mongoose: mongoose,
  PingEvent: PingEvent
};