const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

//db_setup
mongoose.connect('mongodb://localhost/piratedb');
//define schema

var translateSchema = new mongoose.Schema({
    phrase: String,
    translation: String
});

//Create model
var PirateTrans = mongoose.model('piratetranslation', translateSchema);

//the translate endpoint
app.get("/translate", (req,res)=>{
    var text = req.query.text;
    PirateTrans.find({},(err, all_records)=>{
        if(err){console.log(err);
        res.json({result:'**dbErr**'});
        }else if (all_records == []){
            res.json({result:'**dbErr**'});
        }
        else{
            all_records.forEach((rec)=>{
               text = text.replace(new RegExp('\\b'+rec.phrase+'\\b','g'), rec.translation);
            });
            res.json({result:text});
        }
    });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//Main page
app.get('/', (req, res) => {
    //res.send("Hello Node");
    res.render('index',{title: 'Test/Demo'});
});

//The shout JSON
app.get('/shout', (req, res) => {
    "use strict";
  let input = req.query.text;
//  res.send('input:"'+input+'"');
    res.json({result: input.toUpperCase()+"!"});
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    "use strict";
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
