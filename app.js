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
var to_search="";
 var final_result;
var json_final="";

app.get('/signup', function(req, res) {
   // var username = req.body.username;
    //var password = req.body.password;
  //  console.log("post received: %s %s", username, password);
    json_final="";
    to_search="hobbit";
   request({
        url: "http://www.tastekid.com/api/similar?q=movie:"+to_search+"&type=movies&k=245364-testapp-KMQ4HDHR",
        json: true
    }, function (error, response, body) {
       

        if (!error && response.statusCode === 200) {
          
            if(body.Similar.Results.length!=0){
                var count= body.Similar.Results.length;
            if(count>5)
            {
                for(var i=1;i<=5;i++){
                    if(i==5){    json_final+=body.Similar.Results[i].Name}
                    else{
                    json_final+=body.Similar.Results[i].Name+", "}
                }
                
            } 
               
          
     res.json({
      "version": "1.0",
      "response": {
        "shouldEndSession": true,
        "outputSpeech": {
          "type": "SSML",
          "ssml": "<speak>Some similar movies are "+
           json_final+
            "</speak>"
        }
      }
    });
            }
             else if(body.Similar.Results.length==0){res.send("none");}
            else{
                  res.json({
      "version": "1.0",
      "response": {
        "shouldEndSession": true,
        "outputSpeech": {
          "type": "SSML",
          "ssml": "<speak> Cannot find with this name"
            
         
           
        }
      }
    });
            }
     
          
            
             
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
  function get_movies(req, res, next) {

      
    
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

    if (!req.body.request.intent.slots.movie_name ||
        !req.body.request.intent.slots.movie_name.value) {
      res.json({
      "version": "1.0",
      "response": {
        "shouldEndSession": true,
        "outputSpeech": {
          "type": "SSML",
          "ssml": "<speak>Tell me the Movie name<speak>"
          
        }
      }
    });
      
    }
    to_search = req.body.request.intent.slots.movie_name.value;
      console.log("received= "+to_search);
     json_final="";

    request({
        url: "http://www.tastekid.com/api/similar?q=movie:"+to_search+"&type=movies&k=245364-testapp-KMQ4HDHR",
        json: true
    }, function (error, response, body) {
       

        if (!error && response.statusCode === 200) {
          
            if(body.Similar.Results.length!=0 ){
                var count= body.Similar.Results.length;
            if(count>5)
            {
                for(var i=1;i<=5;i++){
                    if(i==5){    json_final+="and "+body.Similar.Results[i].Name}
                    else{
                    json_final+=body.Similar.Results[i].Name+", "}
                }
                
            }
            else{
                for(var i=1;i<=count;i++){
                    if(i==count){    json_final+="and "+body.Similar.Results[i].Name}
                    else{
                    json_final+=body.Similar.Results[i].Name+", "}
                }
            }
               
          
     res.json({
      "version": "1.0",
      "response": {
        "shouldEndSession": true,
        "outputSpeech": {
          "type": "SSML",
          "ssml": "<speak>Some similar movies are "+
           json_final+
            "</speak>"
        }
      }
    });
            }
            else if(body.Similar.Results.length==0){
                  res.json({
      "version": "1.0",
      "response": {
        "shouldEndSession": true,
        "outputSpeech": {
          "type": "SSML",
          "ssml": "<speak>Sorry no results<speak>"
            
         
           
        }
      }
    });
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
