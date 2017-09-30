var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var path = require('path');
var User = require('../models/user');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/trial');
var db = mongoose.connection;
// Register
router.get('/register', function(req, res){
	//res.render('register');
	res.sendFile(path.join(__dirname + '/../views/register.html'));
});

// summary
router.get('/summary', function(req, res){
	//res.render('summary');
	res.sendFile(path.join(__dirname + '/../views/summary.html'));
});

// Register User
router.post('/register', function(req, res){
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;
    console.log(req.body.name);
	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		//res.render('register',{
		//	errors:errors
		//});
	res.status(500).json({
        message: errors.message,
        error: errors
    });
	} else {
		var newUser = new User({
			name: name,
			email:email,
			username: username,
			password: password
		});

		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		//req.flash('success_msg', 'You are registered and can now summary');

		res.redirect('/users/summary');
	}
});

passport.use(new LocalStrategy(
  function(username, password, done) {
  	//console.log(username);
  	//console.log(password);
  User.getUserByUsername(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'Unknown User'});
   	}


  	
   	User.comparePassword(password, user.password, function(err, isMatch){
   		//console.log(password);
   		//console.log(user.password);
   		if(err) throw err;
   		if(isMatch){
   		return done(null, user);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
  }));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
 //User.getUserById(id, function(err, user) {
 	var collection = db.get('user');
        collection.findOne({ '_id' :  id },function(err, user) {
        //User.findById(id, function(err, user) {
           console.log('deserializing user:',user);
           done(err, user);
        });
    //done(null, user);
  });
//});

router.post('/summary',
   passport.authenticate('local', {successRedirect:'/users/summary', failureRedirect:'/'}),
  function(req, res) {
    res.redirect('/');
  });

router.get('/logout', function(req, res){
	req.logout();

	//req.flash('success_msg', 'You are logged out');

	res.redirect('/');
});

module.exports = router;