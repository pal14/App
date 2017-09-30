var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var path = require('path');
var User = require('../models/user');



var mongojs = require('mongojs');
var db = mongojs('investment', ['investment']);

var router = express.Router();

function ensureAuthenticated(req, res, next){
	console.log(req.isAuthenticated())
	if(req.isAuthenticated()){
		return next();
		//res.redirect('/users/register');
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/summary');
		//return false;
	}
}

router.get('/', ensureAuthenticated , function(req, res){
	//res.render('index');

	res.sendFile(path.join(__dirname + '/../public/index.html'));
    
});


router.get('/investment', function(req, res) {

	db.investment.find(function (err, docs) {
		console.log(docs);
		res.json(docs);
	});
}); 

router.post('/investmentlist', function(req,res) {
	console.log(req.body);
	db.investment.insert(req.body, function(err, doc) {
		res.json(doc);
	})
});

router.delete('/investmentlist/:id', function(req, res) {
	var id = req.params.id;
	console.log(id);
	db.investment.remove({_id: mongojs.ObjectId(id)}, function(err, doc) {
		res.json(doc);
	})
});

router.get('/investmentlist/:id', function(req,res) {
	var id = req.params.id;
	console.log(id);
	db.investment.findOne({_id: mongojs.ObjectId(id)}, function(err, doc) {
		res.json(doc);

	})
});

router.put('/investmentlist/:id', function (req, res) {
  var id = req.params.id;
  console.log(req.params.id);
  console.log(req.body);
  db.investment.findAndModify({
    query: {_id: mongojs.ObjectId(id)},
    update: {$set: {type: req.body.type, Investee: req.body.Investee, invDate: req.body.invDate, maturityDate: req.body.maturityDate, invAmount: req.body.invAmount, maturityAmount: req.body.maturityAmount}},
    new: true}, function (err, doc) {
      res.json(doc);
    }
  );
});





module.exports = router;