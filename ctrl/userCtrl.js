const async = require('async');
const User = require('../models/userModel');
const Punchr = require('../models/punchrModel');
const Bcrypt = require('bcryptjs');
const crypto = require('crypto');

/* User athentication functions */



const authTokens = {};
const generateAuthToken = () => {
	return crypto.randomBytes(30).toString('hex');
};


// GET New User Form
exports.new_user_get = function(req,res,next) {
	res.render('new-user')
};

/* Handle New User Post
exports.new_user_post = function(req,res,next) {
	const new_user = new User({ 
		first_name: req.body.first_name, 
		last_name: req.body.last_name, 
		phone: req.body.phone, 
		email: req.body.email,
		pin: req.body.pin
	 });
	new_user.save(function (err) {
		if (err) { return next(err); }
		res.redirect('/users/details/' + new_user.id);
	});
};
*/
// Get List of All Users
exports.list_users = function(req,res,next) {
	User.find({}, 'first_name last_name')
		.populate('user')
		.exec(function (err, all_users) {
			if (err) { return next(err); }
			res.render('user-list', { list_users: all_users })
		})
};

// Get detail page for one user
exports.user_details = function(req,res,next) {
	async.parallel({
		user: function(cb) {
			User.findById(req.params.id)
			.exec(cb)
		},
	}, function(err, results) {
		if (err) { return next(err); }
		res.render('user-detail', {
			name: results.user.name,
                	first_name: results.user.first_name, 
	                last_name: results.user.last_name, 
        	        phone: results.user.phone, 
	                email: results.user.email, 
        	        pin: results.user.pin,
			id: results.user.id,
	         });
	});
};

// GET Edit User Form
exports.user_edit_get = function(req,res,next) {
        async.parallel({
                user: function(cb) {
                        User.findById(req.params.id)
                        .exec(cb)
                },
        }, function(err, results) {
                if (err) { return next(err); }
                res.render('user-edit', {
                        name: results.user.name,
                        first_name: results.user.first_name,
                        last_name: results.user.last_name,
                        phone: results.user.phone,
                        email: results.user.email,
                        pin: results.user.pin,
                        id: results.user.id
                 });
	});
};

// POST Edit User Info
exports.user_edit_post = function(req,res,next) {
	const user = new User({
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		phone: req.body.phone,
		email: req.body.email,
		pin: req.body.pin,
		_id: req.params.id
	});
	User.findByIdAndUpdate(req.params.id, user, {}, function(err,updated) {
		if(err) { return next(err) }
		res.redirect(updated.url);
	});
};

// GET Delete User form
exports.user_delete_get = function(req,res,next){
	async.parallel({
		user: function(cb) {
			User.findById(req.params.id).exec(cb)
		},
	}, function(err, results) {
		if (err) { return next(err); }
		res.render('user-delete', { 
			first_name: results.user.first_name, 
			last_name: results.user.last_name,
			id: results.user.id 
		});
	});
};
	

// POST Delete User Fomr
exports.user_delete_post = function(req,res,next) {
        async.parallel({
                user: function(cb) {
                        User.findById(req.body.id)
                        .exec(cb)
                },
        }, function(err, results) {
                if (err) { return next(err); }
		User.findByIdAndRemove(req.body.id, function deleteUser(err) {
			if (err) { return next(err); }
			res.redirect('/users/list')
		});
	});
}

/* User Login POST */
exports.user_login_post = async (req,res) => {
	try {
		var user = await User.findOne({ pin: req.body.pin }).exec();
		if(!user) { 
			return res.status(400).send({ message: "user not found" });
		}
		if(!Bcrypt.compareSync(req.body.password, user.password)) {
			return res.status(400).send({ message: "invalid password" });
		}
		const authToken = generateAuthToken();
		authTokens[authToken] = user;
		res.cookie('AuthToken', authToken);
		res.redirect('/protected');
	} catch (error) {
		res.status(500).send(error);
	}
};

/* User Login GET */
exports.user_login_get = (req,res,next) => {
	res.render('login')
};

/* User Register POST */
exports.new_user_post = async (req,res) => {
	try {
		req.body.password = Bcrypt.hashSync(req.body.password, 10);
		var user = new User(req.body);
		var result = await user.save();
		res.redirect('/users/details/' + user.id);
	} catch (error) {
		res.status(500).send(error);
	}
};

/* User Dump GET */
exports.user_dump_get = async (req,res) => {
	try {
		var result = await User.find().exec();
		res.send(result);
	} catch (error) {
		response.status(500).send(error);
	}
};

/* GET Protected Page */
exports.protected_get = (req,res) => {
	if (req.user) {
		res.render('protected');
	} else {
		res.render('login');
	}
};
