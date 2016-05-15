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
	//Load up the Instagram API service class
	let instagram = require('./instagram-api-service');

	let tag = request.body.tag;
	let time_start = request.body.time_start;
	let time_end = request.body.time_end;

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

	//Check if a Collection Id was passed
	let collectionId = request.query.collection;
	let limit = request.query.limit ? request.query.limit : 50;
	let offset = request.query.offset ? request.query.offset : 0;

	//This can be one of two queries
	if (collectionId) { //If a Collection Id was passed, query for specific Collection
		queryCollection(collectionId, limit, offset, response);
	} else { //Otherwise query all Collections
		queryAllCollections(response);
	}
};

//Query for a specific collection
function queryCollection(collectionId, limit, offset, response) {
	//Restrict query to specific collection
	let collectionQuery = {
		"_id": collectionId
	};

	//Query all fields
	let queryFields = '';

	//Load up the Collection schema
	let Collection = require('./models/collection');

	//Execute the query
	Collection.find(collectionQuery, queryFields)
		.then(function(collectionResult) { //Success response

			//Query for content
			let contentQuery = {
				"_collection": collectionId
			};

			//Load up the Content schema
			let Content = require('./models/content');

			Content.paginate(contentQuery, {
				offset: offset,
				limit: limit
			}, function(err, result) {
				response.json({
					collection: collectionResult[0],
					content: result
				});
			});


		})
		.catch(function(queryError) { //Error response
			response.json({
				error: queryError
			});
		});
}

//Query for all collections
function queryAllCollections(response) {

	//Set no criteria on the query to return all collections
	let query = {};
	//Query all fields
	let queryFields = '';

	query = {};
	queryFields = '';

	//Load up the Collection schema
	let Collection = require('./models/collection');

	//Execute the query
	Collection.find(query, queryFields)
		.then(function(queryResult) { //Success response
			response.json({
				result: queryResult
			});
		})
		.catch(function(queryError) { //Error response
			response.json({
				error: queryError
			});
		});
}

//This method deletes collections from the db - available to the module
module.exports.deleteCollection = function(query) {
	let Collection = require('./models/collection');
	Collection.find(query)
		.remove()
		.exec();
};
