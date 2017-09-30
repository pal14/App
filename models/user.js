var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var mongojs = require('mongojs');
var db = mongojs('trial', ['trial']);

// User Schema
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index:true
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	name: {
		type: String
	}
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        //newUser.save(callback);
	        db.trial.insert(newUser, function(err, doc) {
		//res.json(doc);
		if(err) {
			console.log(err);
		} else {console.log(doc);}
	});
	        });
	});
	
};

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	//User.findOne(query, callback);
	db.trial.findOne(query, function(err, doc) {
		console.log("queryin");
		if(err) {console.log(err);} 
		else {
		console.log(doc);
		}
		callback(err, doc);
	})
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
		console.log("hash" + hash);
		//console.log(candidatePassword);
    	if(err) throw err;
    	callback(null, isMatch);
	});
}