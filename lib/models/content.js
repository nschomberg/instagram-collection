var mongoose = require('mongoose');

var schema = mongoose.Schema({
	_collection: {
		type: String,
		ref: 'Collection'
	}
}, {
	strict: false //Strict False makes it so that we don't have to define all the fields (there's a bunch :))
});

var model = mongoose.model('Content', schema);

module.exports = model;
