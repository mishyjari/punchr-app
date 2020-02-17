const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	first_name: {
		type: String,
		min: 1,
		max: 30,
		required: true
	},
        last_name: {
                type: String, 
                min: 1,
                max: 30,
                required: true
        },
	pin: {
		type: String,
		min: [4, 'Pin must be four numbers'],
		max: [4, 'Pin must be four numbers'],
		required: true
	},
	phone: { type: String, required: true }, // Add some phone verification here??
	email: { type: String }, // Add email verification here??
	active: { type: Boolean, default: true },
});

// Virtual for user's full name
UserSchema
.virtual('name')
.get(function () { return `${this.first_name} ${this.last_name}` });

// Virtual for user's url
UserSchema
.virtual('url')
.get(function () { return '/users/details/' + this.id; });

// Export Model
module.exports = mongoose.model('User', UserSchema);
