const Punchr = require('../models/punchrModel');
const async = require('async');

// Render Punchr Log Page
exports.log_get = function(req,res,next) {
	Punchr.find({}, 'pin start')
		.populate('entry')
		.exec(function(err,results) {
			if (err) { return next(err) }
			res.render('punchr-log', { log: results });
		});
};

// Handle POST for Punch
exports.new_post = function(req,res,next) {
	const punch = new Punchr({
		pin: req.body.pin
	});
	punch.save(function(err) {
		if (err) { return next(err); }
		res.redirect('/punchr/log/' + punch.id)
	});
};

// Display Info Page for Single Log Entry
exports.log_details = function(req,res,next) {
	async.parallel({
		entry: function(cb) {
			Punchr.findById(req.params.id)
			.exec(cb)
		},
	}, function(err,results) {
		if (err) { return next(err) }
		res.render('punch-detail', {
			pin: results.entry.pin,
			start: results.entry.start
		})
	});
};
			
