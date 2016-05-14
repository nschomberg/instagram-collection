'use strict';

/**
 * This service class handles all the logic for interacting with the database
 */

//This method initializes the Mongo db from the config file - available to the module
module.exports.init = function() {
	//Load up the config file
	let config = require('../config.json');

	//Set up and connect to MongoDB using Mongoose module
	let mongoose = require('mongoose');
	mongoose.connect(config.mongodbUrl);
};

//This method will create a Collection and return its Id  - available to the module
module.exports.createCollection = function(request, response) {
	//Load up the Instagram API module
	let instagram = require('./instagram-api');

	let tag = request.body.tag;
	let time_start = request.body.time_start;
	let time_end = request.body.time_end;
	console.log('tag: ' + tag);
	console.log('time_start: ' + time_start);
	console.log('time_end: ' + time_end);

	//Collect
	instagram.createCollection(tag, time_start, time_end)
		.then(function(result) {
			response.json({ //Success response
				result: result
			});
		})
		.catch(function(error) { //Error response
			response.json({
				error: error
			});
		});
};


//This method will query for either:
// - All Collections
// - A specific Collection if an Id is passed in as a param to the request
module.exports.getCollection = function(request, response) { // - available to the module
	//Inititalize query variables
	let query = {};
	let queryFields = '';
	let object;

	//Check if a Collection Id was passed
	let collectionId = request.query.collection;

	//This can be one of two queries
	if (collectionId) { //If a Collection Id was passed, query for specific Collection
		query = {
			"_collection": collectionId
		};
		queryFields = '';

		//Load up the Content schema
		object = require('./models/content');
	} else { //Otherwise query all Collections
		query = {};
		queryFields = 'tag time_start time_end';

		//Load up the Collection schema
		object = require('./models/collection');
	}

	//Execute the query
	object.find(query, queryFields)
		.then(function(queryResult) { //Success response
			console.log('success');
			console.dir(queryResult);
			response.json({
				result: queryResult
			});
		})
		.catch(function(queryError) { //Error response
			response.json({
				error: queryError
			});
		});
};

//This method deletes collections from the db - available to the module
module.exports.deleteCollection = function(query) {
	let Collection = require('./models/collection');
	Collection.find(query)
		.remove()
		.exec();
};
