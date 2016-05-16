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
let key = (process.env.INSTAGRAM_API_KEY ? process.env.INSTAGRAM_API_KEY : config.instagramApiKey);
let endPoint = "https://api.instagram.com/";
let prePath = "v1/tags/";
let postPath = "/media/recent?access_token=";
let count = "33";
let countParam = `&count=${count}`;
let nPages = 0;

let collection;


/**
 * createCollection - This method will create a collection given a tag, start time, and end time
 * (available to the module)
 *
 * @param  String 	tag        	The tag to collect
 * @param  Date 		time_start 	The start time to collect
 * @param  Date 		time_end   	The end time to collect
 * @return Promise            	The promise for the AJAX
 */
module.exports.createCollection = function(tag, time_start, time_end) {

	//Let's spin up a Promise to make async handling easier
	let promise = new Promise(function(resolve, reject) {

		//Initialize the new collection
		collection = new Collection({
			tag: tag,
			time_start: time_start,
			time_end: time_end,
			isComplete: false
		});

		//String together HTTP request
		let path = `${endPoint}${prePath}${tag}${postPath}${key}${countParam}`;

		//Save newly created collection to DB
		collection.save()
			.then(function() {
				//Resolve the promise with the collection's id
				resolve(collection._id);

				//Start chaining callouts to flesh out the collection
				makeCallout(path, resolve, reject);
			})
			.catch(reject);
	});

	//Return promise to signal when async calls will be finished
	return promise;
};



/**
 * makeCallout - This method makes a callout to the Instagram API
 *
 * @param  String 	path    The URL to callout to
 * @param  Function resolve The success callback
 * @param  Function reject  The error callback
 */
function makeCallout(path, resolve, reject) {

	//Request options
	var options = {
		url: path,
		'method': 'GET',
		json: true
	};

	//Define handling for DB save
	let databaseSave = function(err) {
		if (err) {
			databaseError(err); //Reject the promise if an error occurs
		}
		//Nothing special when the save is successful
	};

	//Define handling for DB error
	let databaseError = function(err) {
		console.log('Error gathering content!');
		console.log(err);
	};

	//Send request
	request(options)
		.then(function(response) {

			//Iterate over each content in the response
			for (let data of response.data) {
				//Figure out tag time
				let tagTime = getTagTime(data, collection.tag);

				//Check if the content's time is between start and end times of the collection
				if (isTimeMatch(tagTime, collection)) {

					//Create a DB object with all the available data
					let content = new Content(data);

					//Set parent Id to collection's id
					content._collection = collection._id;

					//Set tagtime
					content.tagTime = tagTime;

					//Save the content to the DB
					content.save(databaseSave);
				}
			}

			//If there is more content to paginate through, make another callout
			if (response.pagination.next_url) {
				makeCallout(response.pagination.next_url, resolve, reject);
			} else {
				collection.isComplete = true;
				collection.save(databaseSave)
					.catch(databaseError);
			}
		})
		.catch(databaseError); //If callout unsuccessful, reject Promise
}


/**
 * getTagTime - get content's tag time
 *
 * @param  Content	content	The content whose tag time to figure out
 * @return Date     				The time the content was tagged
 */
function getTagTime(content, tag) {
	let createdTime;

	//Check if the tag appears in the content's list of tags
	let isTagged = false;
	//Iterate over the tags
	for (let t of content.tags) {
		if (t.toLowerCase() === tag.toLowerCase()) {
			//If there is a match, set flag to true
			isTagged = true;
			break;
		}
	}

	//If the content was tagged appropriately
	if (isTagged) {
		//Tag time is its created time
		createdTime = content.created_time;
	} else {
		//Otherwise Tag time is the first time its tag was mentionned in the comments
		for (let comment of content.comments.data) {
			//Check if the comment contains the tag
			if (comment.text.toLowerCase()
				.includes(tag.toLowerCase())) {
				//Set tag time to comment's created_time
				createdTime = comment.created_time;
				break;
			}
		}
	}

	//Error case - no created time -> exit
	if (!createdTime) {
		return;
	}

	//Instanciate and return a Date object with the millisecond format timestamp
	return new Date(parseInt(createdTime * 1000));
}


/**
 * isTimeMatch - checks if the given time matches a collection's time frame
 *
 * @param  Date 			date        The date to check
 * @param  Collection collection 	The collection object with time_start and time_end properties
 * @return Boolean            	 	True if the given date is between a collection start and end times
 */
function isTimeMatch(date, collection) {
	return (date >= collection.time_start && date <= collection.time_end);
}
