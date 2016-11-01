'use strict';

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
 // res.render('index', { title: 'Top box Alexa skill' });
    res.sendFile(path.join(__dirname+'/public'+'/index.html'));
});



module.exports = router;
