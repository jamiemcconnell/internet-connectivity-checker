'use strict';

var request = require('request');
var PingEvent = require('./db.js').PingEvent;
var constants = require('../../constants.js');

var urlNum = 0;
var failing = false;
var checkerThread;
var attempts = 0;

var _funcs = {
  
  doRequest: function() {
    var urlToCheck = constants.checkEndpoints[urlNum];
    
    var _event = {
      endpoint: urlToCheck.substr(urlToCheck.indexOf('.') +1),
      success: false,
      duration: 0,
      timestamp: new Date()
    };
    
    var startTime = new Date();
    
    request.head(urlToCheck, {timeout: (constants.attemptConnectionTimeoutSeconds * 1000) }, function(err) {
      _event.duration = (new Date() - startTime);
      if(err === null) {
        _event.success = true;
      } else {
        _event.error = err;
      }
      
      console.log(String.fromCharCode((_event.success ? 0x2713 : 0x2717)) + ' %s [%d]', urlToCheck, _event.duration);
      
      new PingEvent(_event).save();
      
      if(!_event.success) {
        failing = true;
        if(checkerThread !== null) {
          clearInterval(checkerThread);
        }
        
        if(urlNum < (constants.checkEndpoints.length -1)) {
          urlNum++;
        } else {
          urlNum = 0;
        }
        
        if(attempts < constants.maxAttempts) {
        
          setTimeout(function() {
            attempts++;
            _funcs.doRequest();
          }, (constants.reAttemptIntervalSeconds * 1000));
          
        } else {
          // Start again :(
          console.log('Restart checking');
          attempts = 0;
          urlNum = 0;
          _funcs.start();
        }
        
      } else {
        attempts = 0;
        urlNum = 0;
        if(failing) {
          failing = false;
          _funcs.start();
        }
      }
    });
  },
  
  start: function() {
    console.log('Starting connectivity checker %s', new Date());
    checkerThread = setInterval(function() {
      console.log('Checking: %s', new Date());
      
      _funcs.doRequest();
        
    }, (constants.checkIntervalSeconds * 1000));
  }
  
};

module.exports = _funcs;