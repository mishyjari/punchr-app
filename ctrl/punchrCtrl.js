const Punchr = require('../models/punchrModel');
const async = require('async');

// Render Punchr Log Page
exports.log_get = function(req,res,next) {
	Punchr.find({})
		.populate('entry')
		.exec(function(err,results) {
			if (err) { return next(err) }
			res.render('punchr-log', { log: results });
		});
};

// Handle POST for Punch
exports.new_post = function(req,res,next) {
	async.parallel({
		entry: function(cb) {
			Punchr.findOne({ pin: req.body.pin, active: true })
			.exec(cb)
		},
	}, function(err,results) {
		if (err) { return next(err); };
		if ( !results.entry ) 
		{
			const punch = new Punchr({
				pin: req.body.pin
			});
		punch.save(function(err) {
			if (err) { return next(err); }
			res.redirect('/punchr/log/' + punch.id)
			});
		}
		else { Punchr
			.findByIdAndUpdate(results.entry.id, 
				{ end: Date.now(), active: false }, {}, function(err,punch) {
					if (err) { return next(err) }
					res.redirect('/punchr/log')
				});
		};
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
			start: results.entry.start,
			end: results.entry.end,
			hours: results.entry.hours,
			active: results.entry.active,
			id: results.entry.id
		});
	});

};
			
