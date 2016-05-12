var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = Schema({

	tag: {
		type: String,
		required: true
	},
	time_start: {
		type: Number,
		required: true
	},
	time_end: {
		type: Number,
		required: true
	},
	content: [{
		type: Schema.Types.ObjectId,
		ref: 'Content'
	}]
});

var model = mongoose.model('Collection', schema);

module.exports = model;
