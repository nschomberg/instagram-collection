'use strict';

let request = require('request');
let config = require('../config.json');
let Collection = require('./models/collection');
let Content = require('./models/content');

let key = config.instagramApiKey;
let endPoint = "https://api.instagram.com/";
let prePath = "v1/tags/";
let postPath = "/media/recent?access_token=";
let count = "33";
let countParam = `&count=${count}`;
let nPages = 0;

let databaseSave = function(err) {
	if (err) throw err;
	console.log('Content saved!');
};

let collection;

let collect = function (tag) {
	let promise = new Promise(function(resolve,reject){
		console.log('creating shit');
		collection = new Collection({
			tag: tag,
			time_start: 1,
			time_end: 1
		});
		let path = `${endPoint}${prePath}${tag}${postPath}${key}${countParam}`;

		collection.save(function (err) {
			if (err) {console.log('error: '+err); reject(err);return;};
			console.log('collection saved');
			console.log('collection: '+collection._id);
			makeCallout(path,resolve,reject);
		});
	});
	return promise;
}
module.exports.collect = collect;

function makeCallout(path,resolve,reject) {

	var options = {
		url: path,
		'method': 'GET',
	};

	request(options, function(error, response, body) {
		if (error){
			reject(error);
		}
		let responseBody = JSON.parse(body);

		if (!error && response.statusCode == 200) {
			console.log('-------------');


		}

		for (let data of responseBody.data) {
			var t = data.created_time;
			var date = new Date(parseInt(t * 1000));
			console.log(date);

			let content = new Content({
				link: data.link,
				created_time: data.created_time,
				images : {
					low_resolution : {
						url : data.images.low_resolution.url
					},
					thumbnail : {
						url : data.images.thumbnail.url
					},
					standard_resolution : {
						url : data.images.standard_resolution.url
					}
				},
				_collection: collection._id
			});
			console.log('collection: '+collection._id);
			content.save(databaseSave);
		}

		console.log(responseBody.meta.code + ':' + responseBody.data.length);
		if (nPages > 5){
			resolve(collection._id);
		}
		else if (responseBody.pagination.next_url) {
			nPages++;
			makeCallout(responseBody.pagination.next_url,resolve,reject);
		}
	});
}
