'use strict';

/**
 * This service class handles all logic for calling out to the Instagram API
 */

//Load up modules
let request = require('request-promise');
let config = require('../config.json');
let Collection = require('./models/collection');
let Content = require('./models/content');

//Set up some API query variables
let key = config.instagramApiKey;
let endPoint = "https://api.instagram.com/";
let prePath = "v1/tags/";
let postPath = "/media/recent?access_token=";
let count = "33";
let countParam = `&count=${count}`;
let nPages = 0;

let collection;

//This method will create a collection given a tag, start time, and end time
let createCollection = function(tag, time_start, time_end) {

	//Let's spin up a Promise to make async handling easier
	let promise = new Promise(function(resolve, reject) {

		//Initialize the new collection
		collection = new Collection({
			tag: tag,
			time_start: time_start,
			time_end: time_end,
			contents: []
		});

		//String together HTTP request
		let path = `${endPoint}${prePath}${tag}${postPath}${key}${countParam}`;

		//Save newly created collection to DB
		collection.save()
			.then(function() {
				console.log('collection saved!');
				makeCallout(path, resolve, reject);
			})
			.catch(reject);
	});

	//Return promise to signal when async calls will be finished
	return promise;
};
//Make the function available to the module
module.exports.createCollection = createCollection;

//This method makes a callout to the Instagram API
function makeCallout(path, resolve, reject) {

	console.log('making callout ' + collection._id);

	//Request options
	var options = {
		url: path,
		'method': 'GET',
		json: true
	};

	//Define handling for DB save
	let databaseSave = function(err) {
		if (err) {
			reject(err); //Reject the promise if an error occurs
		}
		console.log('content saved');
		//Nothing special when the save is successful
	};

	//Send request
	request(options)
		.then(function(response) {

			//Iterate over each content in the response
			for (let data of response.data) {
				let createdTime = getTagDatetime(data);

				//Check if the content's time is between start and end times of the collection
				if (isTimeMatch(collection, createdTime)) {
					//Set parent Id to collection's id
					data._collection = collection._id;

					//Create a DB object with all the available data
					let content = new Content(data);

					//Add the content to the collection's content array
					console.log(collection);
					console.log(typeof collection.contents);
					if (!collection.contents) {
						collection.contents = [];
					}
					collection.contents.push(content);

					//Save the content to the DB
					content.save(databaseSave);
				}
			}

			//If there is more content to paginate through, make another callout
			if (response.pagination.next_url) {
				makeCallout(response.pagination.next_url, resolve, reject);
			} else {
				collection.save(databaseSave)
					.then(resolve(collection._id))
					.catch(reject);
			}
		})
		.catch(reject); //If callout unsuccessful, reject Promise
}

function getTagDatetime(content) {
	let tagTime = content.created_time;
	let tagDatetime = new Date(parseInt(tagTime * 1000));
	return tagDatetime;
}

function isTimeMatch(collection, t) {
	console.log('SUppp');
	console.log(t);
	console.log(collection.time_start);
	console.log(collection.time_end);
	var isMatch = (t > collection.time_start && t < collection.time_end);
	console.log(isMatch);
	return isMatch;
}
