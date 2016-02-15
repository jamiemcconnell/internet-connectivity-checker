var request = require('request');
var mongoose = require('mongoose');
var uuid = require('uuid');

mongoose.connect('mongodb://192.168.99.100:27017/events');
mongoose.connection.on('connected', function() {
  console.log('Successfully connected to Mongo');
});

var PingEvent = mongoose.model('PingEvent', {
  _id: { type: 'String', default: function() { return uuid.v4(); }},
  endpoint: { type: 'String' },
  duration: { type: 'Number' },
  success: { type: 'Boolean' },
  error: { type: 'Mixed', default: '' },
  timestamp: { type: 'Date' },
});

var seconds = 20;
var checkerThread = null;
var urls = ['http://www.google.com', 'http://www.cloudflare.com', 'http://www.apple.com', 'http://www.microsoft.com'];
var urlNum = 0;
var attempts = 0;
var maxAttempts = (urls.length *2);
var delayBetweenReAttemptsSeconds = 5;
var failing = false;
var confirmedDownCount = 4;

if(confirmedDownCount > maxAttempts) {
  console.log('confirmedDownCount > maxAttempts');
  process.exit(1);
}

var doRequest = function() {
  
  var urlToCheck = urls[urlNum];
  console.log(urlToCheck);
  
  var _event = {
    endpoint: urlToCheck.substr(urlToCheck.indexOf('.') +1),
    success: false,
    duration: 0,
    timestamp: new Date()
  };
  
  var startTime = new Date();
  
  request.head(urlToCheck, {timeout: 5000 }, function(err, res) {
    _event.duration = (new Date() - startTime);
    if(err === null) {
      _event.success = true;
    } else {
      _event.error = err;
    }
    
    new PingEvent(_event).save();
    
    if(!_event.success) {
      failing = true;
      if(checkerThread !== null) {
        clearInterval(checkerThread);
      }
      
      if(urlNum < (urls.length -1)) {
        urlNum++;
      } else {
        urlNum = 0;
      }
      
      if(attempts < maxAttempts) {
      
        setTimeout(function() {
          attempts ++;
          doRequest();
        }, (delayBetweenReAttemptsSeconds * 1000));
        
      } else {
        // Start again :(
        console.log('Restart checking');
        attempts = 0;
        urlNum = 0;
        start();
      }
      
    } else {
      attempts = 0;
      urlNum = 0;
      if(failing) {
        failing = false;
        start();
      }
    }
  });
};

var start = function() {
  checkerThread = setInterval(function() {
    console.log('Checking: %s', new Date());
    
    doRequest();
      
  }, (seconds * 1000));
};


start();