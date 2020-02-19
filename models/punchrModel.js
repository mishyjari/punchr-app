const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./userModel');
const async = require('async');

const PunchrSchema = new Schema({
	pin: {
		type: String,
		min: 4,
		max: 4,
		required: true
	},
	start: {
		type: Date,
		default: Date.now(),
		required: true
	},
	end: {
		type: Date,
		default: null
	},
	active: {
		type: Boolean,
		default: true
	}
});

// Virtual for Punchr url instance
PunchrSchema
.virtual('url')
.get(function() { return '/punchr/log/' + this.id; });

// Virtual to geti user's name

PunchrSchema
.virtual('user_name', { 
	ref: 'User',
	localField: 'pin',
	foreignField: 'pin',
	justOne: true
	})
.get(function() {
	User.findOne({pin: '2112'}).populate('user_name')
	.exec(function(err,res) {
		return res.user_name;
	});
});
	
// Virutal to return wheter or not shift is currently active as a boolean
/*PunchrSchema
.virtual('active')
.get(function() {
	if (this.end) { return false }
	else return "shift is active";
});
*/
// Virtual to get total hours of shift
PunchrSchema
.virtual('hours')
.get(function() {
	if ( this.end )
		{ return Math.floor((this.end.getTime() - this.start.getTime()) / (60*60*1000)*100)/100 }	
//	else
//		{ return Math.floor((Date.now().getTime() - this.start.getTime()) / (60*60*1000)*100)/100 }
});

// Export Module
module.exports = mongoose.model('Punchr', PunchrSchema);
