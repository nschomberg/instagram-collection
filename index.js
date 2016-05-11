'use strict';

var express = require('express');
var app = express();
var mongoose = require('mongoose');
var config = require('./config.json');

mongoose.connect(config.mongodbUrl);
//var database = require('./lib/database-service');
//
//var instagram = require('./lib/instagram-api');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
//app.set('views', __dirname + '/views');
//app.set('view engine', 'ejs');

app.get('/', function(request, response) {
	response.render('public/index.html');
});

app.get('/api/collections', function(request, response) {
	console.dir(request.query);

	var Collection = require('./lib/models/collection');
	var query = {};
	var queryFields = 'tag';

	Collection.find(query, queryFields)
		.then(function (queryResult) {
			response.json({
				collections: queryResult
			});
		})
		.catch(function (queryError) {
			response.json({
				message: queryError
			});
		});
});

app.get('/api/content', function(request, response) {
	console.dir(request.query);

	var Collection = require('./lib/models/content');
	var collectionId = request.query.collection;
	var query = {"_collection" : collectionId};
	var queryFields = 'link created_time images _collection';

	Collection.find(query, queryFields)
		.then(function (queryResult) {
			response.json({
				content: queryResult
			});
		})
		.catch(function (queryError) {
			response.json({
				message: queryError
			});
		});
});

app.post('/api/create', function(request, response) {

	console.dir(request);
	console.dir(request.body);
	console.dir(typeof request.body);
	console.dir(typeof request);



	var instagram = require('./lib/instagram-api');

	instagram.collect(request.query.tag)
		.then(function(result){
			response.json({
				message: 'doof'
			});
		})
		.catch(function(error){
			response.json({
				error : error,
				message: 'Oops, something went wrong'
			});
		});
});


app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});
