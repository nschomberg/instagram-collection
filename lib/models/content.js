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
	images: {
		low_resolution: {
			url: {
				type: String,
				required: false
			}
		},
		thumbnail: {
			url: {
				type: String,
				required: false
			}
		},
		standard_resolution: {
			url: {
				type: String,
				required: false
			}
		}
	},
	_collection: {
		type: String,
		ref: 'Collection'
	}
});

var model = mongoose.model('Content', schema);

module.exports = model;
