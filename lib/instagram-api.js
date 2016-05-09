'use strict';

//let http = require('http');
let request = require('request');
let config = require('../config.json');
let Content = require('./models/content');

let key = config.instagramApiKey;
let endPoint = "https://api.instagram.com/";
let prePath = "v1/tags/";
let postPath = "/media/recent?access_token=";
let count = "33";
let countParam = `&count=${count}`;

let databaseSave = function(err) {
	if (err) throw err;
	console.log('Content saved!');
};

getTag('tecate');



function getTag(tag) {
	let path = `${endPoint}${prePath}${tag}${postPath}${key}${countParam}`;
	makeCallout(path);
}

function makeCallout(path) {

	var options = {
		url: path,
		'method': 'GET',
	};

	request(options, function(error, response, body) {
		//console.log(typeof body);
		//console.log(typeof response);
		//console.log(typeof response.body);


		let responseBody = JSON.parse(body);

		if (!error && response.statusCode == 200) {
			console.log('-------------');
			//console.log(response);
			//console.log('-------------');

		}

		for (let data of responseBody.data) {
			var t = data.created_time;
			var date = new Date(parseInt(t * 1000));
			console.log(date);

			let content = new Content({
				link: data.link,
				created_time: data.created_time
			});

			content.save(databaseSave);
		}

		console.log(responseBody.meta.code + ':' + responseBody.data.length);
		if (responseBody.pagination.next_url) {
			makeCallout(responseBody.pagination.next_url);
		}
	});
}

/*http.get({
        host: endPoint,
    }, function(response) {
       console.dir(response);
    });
*/
