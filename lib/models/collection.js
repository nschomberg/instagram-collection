var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = Schema({

	tag: {
		type: String,
		required: true
	},
	time_start: {
		type: Date,
		required: true
	},
	time_end: {
		type: Date,
		required: true
	},
	contents: [{
		type: Schema.Types.ObjectId,
		ref: 'Content'
	}]
});

var model = mongoose.model('Collection', schema);

module.exports = model;
