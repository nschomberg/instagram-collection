var mongoose = require('mongoose');

var schema = mongoose.Schema({
	link: {
		type: String,
		required: true
	},
	created_time: {
		type: Number,
		required: true
	}

});

var model = mongoose.model('Content', schema);

module.exports = model;
