var mongoose = require('mongoose');

var schema = mongoose.Schema({
	link: {
		type: String,
		required: true
	},
	created_time: {
		type: Number,
		required: true
	},
	_collection : { type: String, ref: 'Collection' }
});

var model = mongoose.model('Content', schema);

module.exports = model;
