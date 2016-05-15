'use strict';

/**
 * This class models the Collection object's Schema for the DB
 */

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let schema = Schema({

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
	isComplete: {
		type: Boolean,
		required: false
	}
});

let model = mongoose.model('Collection', schema);

module.exports = model; //Make the Schema accessible to the module
