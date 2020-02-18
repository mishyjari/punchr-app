const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
});

// Virtual for Punchr url instance
PunchrSchema
.virtual('url')
.get(function() { return '/blog/posts/' + this.id; });

// Virtual to get user's name
PunchrSchema
.virtual('name')
.get(function() { return 'Gonna need to access the user db info for this one'; });

// Virutal to return wheter or not shift is currently active as a boolean
PunchrSchema
.virtual('active')
.get(function() {
	if (this.end) { return true }
	else return false;
});

// Virtual to get total hours of shift
PunchrSchema
.virtual('hours')
.get(function() {
	if ( this.end )
		{ return this.end.getTime() - this.start.getTime() }	
	else
		{ return Date.getTime() - this.start.getTime() }
});

// Export Module
module.exports = mongoose.model('Punchr', PunchrSchema);
