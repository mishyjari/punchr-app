const async = require('async');
const User = require('../models/userModel');

// GET New User Form
exports.new_user_get = function(req,res,next) {
	res.render('new-user')
};

// Handle New User Post
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
                	first_name: results.user.first_name, 
	                last_name: results.user.last_name, 
        	        phone: results.user.phone, 
	                email: results.user.email, 
        	        pin: results.user.pin,
			id: results.user.id 
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
                        first_name: results.user.first_name,
                        last_name: results.user.last_name,
                 });
	});
};

// POST Edit User Info
exports.user_edit_post = function(req,res,next) {
	res.send('edit user POST')
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
                        User.findById(req.body.userid)
                        .exec(cb)
                },
        }, function(err, results) {
                if (err) { return next(err); }
		User.findByIdAndRemove(req.body.userid, function deleteUser(err) {
			if (err) { return next(err); }
			res.render('user-list', { memo: "user deleted" })
		});
	});
}
