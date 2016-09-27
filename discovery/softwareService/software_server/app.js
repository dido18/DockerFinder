'use strict';

var express = require('express');
var path = require('path');
var logger = require('morgan');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');


var app = express();

app.set('port', process.env.PORT || 3001);
app.set('db_path', 'software_db');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type:'application/vnd.api+json'}));
app.use(methodOverride());


var env = process.env.NODE_ENV || 'development';
//table name of the mongo database
var table ="/software";


app.use('/api', require('./routes/software'));   //api/software
app.use('/api', require('./routes/system'));   //api/system

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    console.log("development mode \n");
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.json({"message": err.message,
          "error": err
        });
      });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  console.log("production");
  res.status(err.status || 500);
    res.json({"message": err.message,
      "error": err
    });
});


//###################################################################################
//                                 CONNECTION DATABASE
// #################################################################################

// Connect to the database before starting the application server.
var mongo_path = 'mongodb://'+app.get('db_path') + table;

console.log("Try to connect "+ mongo_path);
mongoose.connect(mongo_path, function (err, database) {
    if (err) {
        console.log(err);
        //return next(err);
        process.exit(1);

    }
    // Save database object from the callback for reuse.
    console.log("Database connection ready");
});


// Start server
var server = app.listen(app.get('port'), function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('\nSoftware manger is listening port '+ port +"\n");
});
