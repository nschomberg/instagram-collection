'use strict';

/**
 * This class models the Content object's Schema for the DB
 */

let mongoose = require('mongoose');

let schema = mongoose.Schema({
	_collection: {
		type: String,
		ref: 'Collection'
	}
}, {
	strict: false //Strict False makes it so that we don't have to define all the fields (there's a bunch :))
});

let model = mongoose.model('Content', schema);

module.exports = model; //Make the Schema accessible to the module
