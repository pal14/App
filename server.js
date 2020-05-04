var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('investment', ['investment']);
var bodyparser = require('body-parser');
var expressValidator = require('express-validator');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var mongo = require('mongodb');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/trial');
var db = mongoose.connection;

app.use(express.static(__dirname + "/public"));
//app.use(express.static(__dirname, 'public'), {index: ''});
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());

app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));


app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));


var routes = require('./routes/route')
var users = require('./routes/users');

app.use('/', routes)
app.use('/users', users);

app.listen(8080);
console.log("server running on 8080");