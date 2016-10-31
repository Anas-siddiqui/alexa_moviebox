'use strict';
let alexaVerifier = require('alexa-verifier');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
 var request = require("request");
var app = express();
//
 var final_result;
app.get('/signup', function(req, res) {
   // var username = req.body.username;
    //var password = req.body.password;
  //  console.log("post received: %s %s", username, password);

    var temp;
  request({
        url: "http://www.tastekid.com/api/similar?q=movie:inception&type=movies&k=245364-testapp-KMQ4HDHR",
        json: true
    }, function (error, response, body) {

        if (!error && response.statusCode === 200) {
          // res.send(body.Similar.Results[0].Name); //Print the json response
           temp=body;
            res.send(temp);
        }
    });


    

});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
//app.use(bodyParser.json());
app.use(bodyParser.json({
    verify: function getRawBody(req, res, buf) {
        req.rawBody = buf.toString();
    }
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
function requestVerifier(req, res, next) {

    alexaVerifier(
        req.headers.signaturecertchainurl,
        req.headers.signature,
        req.rawBody,
        function verificationCallback(err) {
            if (err) {
                res.status(401).json({ message: 'Verification Failure', error: err });
            } else {
                next();
            }
        }
    );
}
    


// catch 404 and forward to error handler

app.post('/result',  function(req, res) {
    // We'll fill this out later!
   // res.json({ hello: 'world' });
   var temp;
    if (req.body.request.type === 'LaunchRequest') { /* ... */ }
  else if (req.body.request.type === 'SessionEndedRequest') { /* ... */ }
  else if (req.body.request.type === 'IntentRequest' &&
           req.body.request.intent.name === 'getsimilarmovies') {

    if (!req.body.request.intent.slots.Day ||
        !req.body.request.intent.slots.Day.value) {
      // Handle this error by producing a response like:
      // "Hmm, what day do you want to know the forecast for?"
    }
    let to_search = req.body.request.intent.slots.movie_name.value;
      console.log("received= "+to_search);
     

    // Do your business logic to get weather data here!
    // Then send a JSON response...
     
 request({
        url: "http://www.tastekid.com/api/similar?q=movie:"+to_search+"&type=movies&k=245364-testapp-KMQ4HDHR",
        json: true
    }, function (error, response, body) {

        if (!error && response.statusCode === 200) {
           //Print the json response
      temp=body;
          //  res.send(body.Similar.Results[0].Name);
             
        }
    });


 
      
      res.json({
      "version": "1.0",
      "response": {
        "shouldEndSession": true,
        "outputSpeech": {
          "type": "SSML",
          "ssml": "<speak>Some similar movies are "+
           to_search+
            ", "+
         
            "</speak>"
        }
      }
    });
  }
});






app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});







// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});




module.exports = app;
